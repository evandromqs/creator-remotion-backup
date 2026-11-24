import asyncio
import os
import sys
import json
import base64
import webbrowser

os.environ["PYTHONWARNINGS"] = "ignore"

from fastmcp import Client
from colab_mcp.websocket_server import ColabWebSocketServer, COLAB, SCRATCH_PATH
from colab_mcp.session import ColabTransport

def log(msg):
    print(msg, flush=True)

# Caminho do pacote do projeto
PROJECT_ZIP = r"c:\Users\evand\lab\creator-remotion-backup\project.zip"

async def run_cell_and_wait(client, cell_code, description=""):
    log(f"\n---> [INICIANDO] {description}...")
    add_res = await client.call_tool("add_code_cell", {
        "cellIndex": 999,
        "language": "python",
        "code": cell_code
    })
    
    cell_id = None
    if hasattr(add_res, "structured_content") and isinstance(add_res.structured_content, dict):
        cell_id = add_res.structured_content.get("newCellId")
    if not cell_id and hasattr(add_res, "data") and isinstance(add_res.data, dict):
        cell_id = add_res.data.get("newCellId")
    if not cell_id and hasattr(add_res, "content") and add_res.content:
        try:
            parsed = json.loads(add_res.content[0].text)
            cell_id = parsed.get("newCellId")
        except Exception:
            cell_id = add_res.content[0].text.strip()
            
    if not cell_id:
        log(f"[ERRO] Nao foi possivel obter o ID da celula. Resposta: {add_res}")
        return False

    log(f"Executando celula ({cell_id})...")
    run_res = await client.call_tool("run_code_cell", {"cellId": cell_id})
    log(f"Retorno imediato: {run_res}")
    return True

async def main():
    log("="*70)
    log("PIPELINE DE RENDERIZACAO REMOTION NO GOOGLE COLAB PRO")
    log("Conta: aeacaioficial@gmail.com")
    log("="*70)
    
    if not os.path.exists(PROJECT_ZIP):
        log(f"[ERRO] Arquivo {PROJECT_ZIP} nao encontrado!")
        return

    file_size_mb = os.path.getsize(PROJECT_ZIP) / (1024 * 1024)
    log(f"Pacote do projeto pronto: {PROJECT_ZIP} ({file_size_mb:.2f} MB)")
    
    # Ler zip em base64
    with open(PROJECT_ZIP, "rb") as f:
        b64_content = base64.b64encode(f.read()).decode("utf-8")
    log(f"Pacote codificado em Base64 ({len(b64_content) / (1024*1024):.2f} MB)")

    wss = ColabWebSocketServer()
    async with wss:
        token = wss.token
        port = wss.port
        url_empty = f"https://colab.research.google.com/notebooks/antigravity_cli.ipynb#mcpProxyToken={token}&mcpProxyPort={port}"
        fragment = f"#mcpProxyToken={token}&mcpProxyPort={port}"
        
        log("\n" + "="*70)
        log("LINKS DE CONEXAO DO COLAB:")
        log("="*70)
        log("Opcao 1 (Abrir novo notebook na conta certa):")
        log(f"{url_empty}\n")
        log("Opcao 2 (Se voce ja esta com seu notebook aberto, cole no final da URL dele):")
        log(f"{fragment}\n")
        log("="*70)
        
        # Abrir automaticamente
        try:
            webbrowser.open_new(url_empty)
        except Exception:
            pass

        log("Aguardando conexao do Google Colab (timeout 15 minutos)...")
        try:
            await asyncio.wait_for(wss.connection_live.wait(), timeout=900.0)
            log("\n[SUCESSO] Google Colab conectado via WebSocket local!")
        except asyncio.TimeoutError:
            log("\n[TIMEOUT] Nenhuma conexao recebida em 15 minutos.")
            return

        transport = ColabTransport(wss)
        async with Client(transport) as client:
            tools = await client.list_tools()
            log(f"\nFerramentas MCP conectadas: {[t.name for t in tools]}")
            
            # Etapa 1: Verificar GPU
            gpu_check_code = (
                "!nvidia-smi\n"
            )
            await run_cell_and_wait(client, gpu_check_code, "Verificando GPU e Hardware")
            
            # Etapa 2: Baixar e descompactar project.zip
            transfer_code = (
                "!curl -sL -o /content/project.zip https://tmpfiles.org/dl/wlAJjSiGYpR3/project.zip\n"
                "import zipfile\n"
                "with zipfile.ZipFile('/content/project.zip', 'r') as zip_ref:\n"
                "    zip_ref.extractall('/content/creator-remotion')\n"
                "print('Projeto extraido com sucesso em /content/creator-remotion!')\n"
                "!ls -la /content/creator-remotion\n"
            )
            await run_cell_and_wait(client, transfer_code, "Transferindo codigo das 18 cenas 3D e assets")

            # Etapa 3: Instalar Node 20 e dependencias headless do Remotion
            setup_env_code = (
                "%%bash\n"
                "echo '--- Instalando Node 20 LTS ---'\n"
                "if ! command -v node &> /dev/null || [ \"$(node -v | cut -d'.' -f1)\" != \"v20\" ]; then\n"
                "    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - > /dev/null 2>&1\n"
                "    apt-get install -y nodejs > /dev/null 2>&1\n"
                "fi\n"
                "echo \"Node: $(node -v)\"\n"
                "echo \"NPM: $(npm -v)\"\n"
                "\n"
                "echo '--- Instalando dependencias do Chromium/Remotion ---'\n"
                "apt-get update -qq > /dev/null 2>&1\n"
                "apt-get install -y -qq libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \\\n"
                "    libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 \\\n"
                "    libgbm1 libasound2 ffmpeg fonts-liberation libpango-1.0-0 libcairo2 > /dev/null 2>&1\n"
                "echo 'Dependencias de sistema prontas!'\n"
            )
            await run_cell_and_wait(client, setup_env_code, "Instalando Node.js 20 e Chromium headless")

            # Etapa 4: npm install
            npm_code = (
                "%%bash\n"
                "cd /content/creator-remotion\n"
                "echo '--- Instalando pacotes npm do Remotion e Three.js ---'\n"
                "npm install --legacy-peer-deps --loglevel=error\n"
                "echo 'npm install finalizado com sucesso!'\n"
            )
            await run_cell_and_wait(client, npm_code, "Executando npm install no Remotion")

            # Etapa 5: Renderizacao do video completo
            render_code = (
                "%%bash\n"
                "cd /content/creator-remotion\n"
                "mkdir -p out\n"
                "echo '=================================================='\n"
                "echo 'INICIANDO RENDERIZACAO COMPLETA (3.400 FRAMES)'\n"
                "echo '=================================================='\n"
                "npx remotion render src/index.ts Main out/video_final_gps.mp4 --concurrency=4 --gl=angle\n"
                "echo '=================================================='\n"
                "echo 'RENDERIZACAO CONCLUIDA COM SUCESSO!'\n"
                "ls -lh out/video_final_gps.mp4\n"
                "echo '=================================================='\n"
            )
            await run_cell_and_wait(client, render_code, "Renderizando video completo (Main)")

            # Etapa 6: Envio Telegram ou Download
            finish_code = (
                "# Formulario para envio Telegram e download\n"
                "import os, requests\n"
                "from google.colab import files\n"
                "\n"
                "video_path = '/content/creator-remotion/out/video_final_gps.mp4'\n"
                "if os.path.exists(video_path):\n"
                "    size_mb = os.path.getsize(video_path) / (1024*1024)\n"
                "    print(f'Video pronto: {video_path} ({size_mb:.2f} MB)')\n"
                "    \n"
                "    TELEGRAM_BOT_TOKEN = '' # @param {type:\"string\"}\n"
                "    TELEGRAM_CHAT_ID = ''   # @param {type:\"string\"}\n"
                "    \n"
                "    if TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID:\n"
                "        print('Enviando video para o Telegram...')\n"
                "        url = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendDocument'\n"
                "        with open(video_path, 'rb') as f:\n"
                "            res = requests.post(url, data={'chat_id': TELEGRAM_CHAT_ID, 'caption': '🎬 Video GPS renderizado com sucesso no Colab Pro!'}, files={'document': f})\n"
                "        print('Status Telegram:', res.status_code, res.text[:200])\n"
                "    else:\n"
                "        print('Para enviar no Telegram, preencha TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID acima.')\n"
                "        print('Baixando video para o seu computador...')\n"
                "        files.download(video_path)\n"
                "else:\n"
                "    print('Arquivo de video nao encontrado!')\n"
            )
            await run_cell_and_wait(client, finish_code, "Preparando download e envio do video")

            log("\n" + "="*70)
            log("PIPELINE COMPLETO INJETADO E EXECUTANDO NO GOOGLE COLAB PRO!")
            log("="*70)

            while wss.connection_live.is_set():
                await asyncio.sleep(5)

if __name__ == "__main__":
    asyncio.run(main())
