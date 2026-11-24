import asyncio
import json
import webbrowser
from colab_mcp.websocket_server import ColabWebSocketServer, COLAB, SCRATCH_PATH

import sys

def log(msg):
    print(msg, flush=True)

async def main():
    log("Iniciando Colab WebSocket Server...")
    wss = ColabWebSocketServer()
    async with wss:
        url = f"{COLAB}{SCRATCH_PATH}#mcpProxyToken={wss.token}&mcpProxyPort={wss.port}"
        log(f"\n==========================================")
        log(f"URL DE CONEXAO DO COLAB:")
        log(url)
        log(f"==========================================\n")
        
        # Abrir no navegador padrao
        webbrowser.open_new(url)
        log("Aguardando conexao do Google Colab (timeout 90s)...")
        
        try:
            await asyncio.wait_for(wss.connection_live.wait(), timeout=90.0)
            print("[SUCESSO] Google Colab conectado ao WebSocket local!")
            
            # Vamos ler as primeiras mensagens recebidas
            print("Aguardando mensagens do Colab...")
            while wss.connection_live.is_set():
                msg = await asyncio.wait_for(wss.read_stream.receive(), timeout=15.0)
                print(f"Recebido: {msg}")
        except asyncio.TimeoutError:
            print("[TIMEOUT] O usuario nao abriu ou o Colab nao conectou a tempo.")

if __name__ == "__main__":
    asyncio.run(main())
