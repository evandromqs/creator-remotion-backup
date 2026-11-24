import asyncio
import os
import json
import base64

os.environ["PYTHONWARNINGS"] = "ignore"

from fastmcp import Client
from colab_mcp.websocket_server import ColabWebSocketServer
from colab_mcp.session import ColabTransport

def log(msg):
    print(msg, flush=True)

PROJECT_ZIP = r"c:\Users\evand\lab\creator-remotion-backup\project.zip"

async def run_cell(client, code, desc=""):
    if desc:
        log(f"\n---> {desc}")
    add_res = await client.call_tool("add_code_cell", {
        "cellIndex": 999,
        "language": "python",
        "code": code
    })
    cell_id = None
    if hasattr(add_res, "structured_content") and isinstance(add_res.structured_content, dict):
        cell_id = add_res.structured_content.get("newCellId")
    if not cell_id and hasattr(add_res, "content") and add_res.content:
        try:
            cell_id = json.loads(add_res.content[0].text).get("newCellId")
        except Exception:
            pass
    if not cell_id:
        log(f"[ERRO] Nao obteve cell_id: {add_res}")
        return None
    res = await client.call_tool("run_code_cell", {"cellId": cell_id})
    return res

async def main():
    with open(PROJECT_ZIP, "rb") as f:
        b64_data = base64.b64encode(f.read()).decode("utf-8")
    
    chunk_size = 320 * 1024  # 320 KB per chunk
    chunks = [b64_data[i:i+chunk_size] for i in range(0, len(b64_data), chunk_size)]
    log(f"Pacote pronto: {len(chunks)} blocos seguros de ~320 KB.")

    wss = ColabWebSocketServer()
    async with wss:
        token = wss.token
        port = wss.port
        url = f"https://colab.research.google.com/notebooks/antigravity_cli.ipynb#mcpProxyToken={token}&mcpProxyPort={port}"
        fragment = f"#mcpProxyToken={token}&mcpProxyPort={port}"
        
        log("\n" + "="*70)
        log("CONECTE PARA ENVIAR EM BLOCOS E RENDERIZAR:")
        log(f"Link: {url}")
        log(f"Ou cole na URL aberta: {fragment}")
        log("="*70)

        await asyncio.wait_for(wss.connection_live.wait(), timeout=900.0)
        log("\n[SUCESSO] Colab conectado!")

        transport = ColabTransport(wss)
        async with Client(transport) as client:
            # Limpar b64 anterior
            await run_cell(client, "open('/content/project.zip.b64', 'w').close()", "Preparando buffer no Colab...")
            
            # Enviar cada chunk
            for idx, chunk in enumerate(chunks, 1):
                code = f"with open('/content/project.zip.b64', 'a') as f:\n    f.write('{chunk}')\nprint('Bloco {idx}/{len(chunks)} recebido!')"
                await run_cell(client, code, f"Enviando bloco {idx}/{len(chunks)}...")

            # Decodificar e extrair
            extract_code = (
                "import base64, zipfile, os\n"
                "with open('/content/project.zip.b64', 'r') as f:\n"
                "    data = base64.b64decode(f.read())\n"
                "with open('/content/project.zip', 'wb') as f:\n"
                "    f.write(data)\n"
                "os.makedirs('/content/creator-remotion', exist_ok=True)\n"
                "with zipfile.ZipFile('/content/project.zip', 'r') as z:\n"
                "    z.extractall('/content/creator-remotion')\n"
                "print('Projeto extraido com sucesso! Tamanho zip:', len(data))\n"
            )
            res = await run_cell(client, extract_code, "Descompactando project.zip no Colab...")
            log(f"Resultado extracao: {res}")

            # npm install
            npm_code = (
                "%%bash\n"
                "cd /content/creator-remotion\n"
                "npm install --legacy-peer-deps --loglevel=error\n"
                "echo 'npm install concluido!'\n"
            )
            res = await run_cell(client, npm_code, "Executando npm install...")
            log(f"Resultado npm: {res}")

            # Render
            render_code = (
                "%%bash\n"
                "cd /content/creator-remotion\n"
                "mkdir -p out\n"
                "npx remotion render src/index.ts Main out/video_final_gps.mp4 --concurrency=4 --gl=angle\n"
                "ls -lh out/video_final_gps.mp4\n"
            )
            res = await run_cell(client, render_code, "Renderizando video completo (3.400 frames)...")
            log(f"Resultado render: {res}")

            # Download
            dl_code = (
                "import os\n"
                "from google.colab import files\n"
                "p = '/content/creator-remotion/out/video_final_gps.mp4'\n"
                "if os.path.exists(p):\n"
                "    print('Baixando video_final_gps.mp4...')\n"
                "    files.download(p)\n"
                "else:\n"
                "    print('Erro: video nao encontrado em', p)\n"
            )
            res = await run_cell(client, dl_code, "Iniciando download do video...")
            log(f"Resultado download: {res}")

            log("\n[CONCLUIDO] Pipeline finalizado!")

if __name__ == "__main__":
    asyncio.run(main())
