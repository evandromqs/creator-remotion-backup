import asyncio
import os
import sys
import json
import webbrowser

os.environ["PYTHONWARNINGS"] = "ignore"

from fastmcp import Client
from colab_mcp.websocket_server import ColabWebSocketServer, COLAB, SCRATCH_PATH
from colab_mcp.session import ColabTransport

def log(msg):
    print(msg, flush=True)

async def main():
    log("="*60)
    log("INICIANDO COLAB MCP BRIDGE - COLAB PRO")
    log("Conta Alvo: aeacaioficial@gmail.com")
    log("="*60)
    
    wss = ColabWebSocketServer()
    async with wss:
        token = wss.token
        port = wss.port
        base_url = f"{COLAB}{SCRATCH_PATH}"
        link_aeacai = f"{base_url}?authuser=aeacaioficial@gmail.com#mcpProxyToken={token}&mcpProxyPort={port}"
        link_default = f"{base_url}#mcpProxyToken={token}&mcpProxyPort={port}"
        
        log("\n" + "="*70)
        log("LINK EXCLUSIVO PARA: aeacaioficial@gmail.com (Colab Pro)")
        log("="*70)
        log(f"{link_aeacai}\n")
        log("Link Alternativo (perfil ativo atual do navegador):")
        log(f"{link_default}\n")
        log("="*70)
        
        # Tentar abrir no navegador
        try:
            webbrowser.open_new(link_aeacai)
        except Exception:
            pass

        log("Aguardando conexao do Google Colab (timeout 15 minutos)...")
        try:
            await asyncio.wait_for(wss.connection_live.wait(), timeout=900.0)
            log("\n[SUCESSO] Google Colab (aeacaioficial@gmail.com) conectado via WebSocket local!")
        except asyncio.TimeoutError:
            log("\n[TIMEOUT] Nenhuma conexao recebida em 15 minutos.")
            return

        # Conectar cliente MCP
        transport = ColabTransport(wss)
        async with Client(transport) as client:
            tools = await client.list_tools()
            tool_names = [t.name for t in tools]
            log(f"\nFerramentas MCP disponiveis no Colab: {tool_names}")
            
            # Testar execucao de teste rapido
            log("\nInjetando celula de teste de ambiente e GPU...")
            test_code = (
                "import os, sys, platform\n"
                "print('=== CONEXAO COLAB MCP ESTABELECIDA ===')\n"
                "print('Conta:', 'aeacaioficial@gmail.com')\n"
                "print('Python:', platform.python_version())\n"
                "try:\n"
                "    import torch\n"
                "    has_gpu = torch.cuda.is_available()\n"
                "    print('GPU Ativa:', has_gpu)\n"
                "    if has_gpu:\n"
                "        print('Nome da GPU:', torch.cuda.get_device_name(0))\n"
                "        print('VRAM Total (GB):', round(torch.cuda.get_device_properties(0).total_memory / (1024**3), 2))\n"
                "    else:\n"
                "        print('Ambiente rodando em CPU (Se desejar GPU no Colab Pro: Runtime > Change runtime type > T4 / A100 GPU)')\n"
                "except Exception as e:\n"
                "    print('GPU Check error:', e)\n"
            )
            
            add_res = await client.call_tool("add_code_cell", {
                "cellIndex": 0,
                "language": "python",
                "code": test_code
            })
            log(f"Resposta add_code_cell: {add_res}")
            
            # Extrair cell_id de forma robusta
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
            
            log(f"ID real da celula: {cell_id}")

            if cell_id:
                log(f"Executando celula ID: {cell_id} no Colab...")
                run_res = await client.call_tool("run_code_cell", {"cellId": cell_id})
                log(f"\n[RETORNO DA EXECUCAO NO COLAB]:\n{run_res}")
                
                await asyncio.sleep(2)
                cells = await client.call_tool("get_cells", {"includeOutputs": True})
                log(f"\n[ESTADO DO NOTEBOOK]:\n{cells}")
            
            log("\n" + "="*60)
            log("[STATUS: PRONTO] Google Colab Pro autenticado e operacional via MCP!")
            log("Aguardando proximos comandos...")
            log("="*60)

            # Manter a conexao viva por ate 30 minutos aguardando novos comandos
            while wss.connection_live.is_set():
                await asyncio.sleep(5)

if __name__ == "__main__":
    asyncio.run(main())
