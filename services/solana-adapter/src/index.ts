import 'dotenv/config'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import WebSocket from 'ws'
import { EventEmitter } from 'events'

interface SolanaMarketData {
  type: string
  underlying: string
  market: string
  strike?: number
  expiry?: string
  iv?: number
  oi?: number
  mark?: number
  timestamp: string
}

class SolanaAdapter extends EventEmitter {
  private connection: Connection
  private orchestratorWs: WebSocket | null = null
  private isConnected = false
  private reconnectInterval: NodeJS.Timeout | null = null
  
  constructor() {
    super()
    
    const rpcUrl = process.env.HELIUS_RPC || clusterApiUrl('mainnet-beta')
    this.connection = new Connection(rpcUrl, 'confirmed')
    
    console.log(`Solana Adapter initialized with RPC: ${rpcUrl}`)
  }
  
  async start() {
    try {
      await this.connectToOrchestrator()
      await this.subscribeToMarkets()
      console.log('Solana Adapter started successfully')
    } catch (error) {
      console.error('Failed to start Solana Adapter:', error)
      this.scheduleReconnect()
    }
  }
  
  private async connectToOrchestrator() {
    const orchestratorUrl = process.env.ORCH_WS_SINK || 'ws://localhost:8080/ingest/solana'
    
    return new Promise<void>((resolve, reject) => {
      try {
        this.orchestratorWs = new WebSocket(orchestratorUrl)
        
        this.orchestratorWs.on('open', () => {
          console.log('Connected to orchestrator WebSocket')
          this.isConnected = true
          resolve()
        })
        
        this.orchestratorWs.on('message', (data) => {
          try {
            const message = JSON.parse(data.toString())
            this.handleOrchestratorMessage(message)
          } catch (error) {
            console.error('Failed to parse orchestrator message:', error)
          }
        })
        
        this.orchestratorWs.on('close', () => {
          console.log('Orchestrator WebSocket connection closed')
          this.isConnected = false
          this.scheduleReconnect()
        })
        
        this.orchestratorWs.on('error', (error) => {
          console.error('Orchestrator WebSocket error:', error)
          reject(error)
        })
        
      } catch (error) {
        reject(error)
      }
    })
  }
  
  private async subscribeToMarkets() {
    try {
      // Subscribe to Zeta Markets
      await this.subscribeToZetaMarkets()
      
      // Subscribe to PsyOptions Markets
      await this.subscribeToPsyOptionsMarkets()
      
      console.log('Subscribed to Solana options markets')
    } catch (error) {
      console.error('Failed to subscribe to markets:', error)
    }
  }
  
  private async subscribeToZetaMarkets() {
    try {
      // Mock Zeta markets subscription for demo
      const zetaMarkets = [
        { underlying: 'SOL', strike: 95, expiry: '2024-01-26', iv: 0.65, oi: 1250, mark: 3.25 },
        { underlying: 'SOL', strike: 100, expiry: '2024-01-26', iv: 0.62, oi: 2100, mark: 1.85 },
        { underlying: 'SOL', strike: 105, expiry: '2024-01-26', iv: 0.60, oi: 1800, mark: 0.95 }
      ]
      
      // Simulate market updates
      setInterval(() => {
        zetaMarkets.forEach(market => {
          this.updateMarketData('zeta', market)
        })
      }, 5000) // Update every 5 seconds
      
    } catch (error) {
      console.error('Failed to subscribe to Zeta markets:', error)
    }
  }
  
  private async subscribeToPsyOptionsMarkets() {
    try {
      // Mock PsyOptions markets subscription for demo
      const psyMarkets = [
        { underlying: 'SOL', strike: 90, expiry: '2024-02-23', iv: 0.68, oi: 950, mark: 5.75 },
        { underlying: 'SOL', strike: 95, expiry: '2024-02-23', iv: 0.65, oi: 1600, mark: 3.45 },
        { underlying: 'SOL', strike: 100, expiry: '2024-02-23', iv: 0.63, oi: 2200, mark: 1.95 }
      ]
      
      // Simulate market updates
      setInterval(() => {
        psyMarkets.forEach(market => {
          this.updateMarketData('psyoptions', market)
        })
      }, 7000) // Update every 7 seconds
      
    } catch (error) {
      console.error('Failed to subscribe to PsyOptions markets:', error)
    }
  }
  
  private updateMarketData(source: string, marketData: any) {
    try {
      // Add some random variation to simulate real market data
      const variation = (Math.random() - 0.5) * 0.1 // ±5% variation
      
      const updatedData: SolanaMarketData = {
        type: `${source}_market_update`,
        underlying: marketData.underlying,
        market: `${marketData.underlying}-${marketData.strike}-${marketData.expiry}`,
        strike: marketData.strike,
        expiry: marketData.expiry,
        iv: marketData.iv * (1 + variation),
        oi: marketData.oi + Math.floor((Math.random() - 0.5) * 100),
        mark: marketData.mark * (1 + variation),
        timestamp: new Date().toISOString()
      }
      
      this.sendToOrchestrator(updatedData)
      
    } catch (error) {
      console.error('Failed to update market data:', error)
    }
  }
  
  private sendToOrchestrator(data: SolanaMarketData) {
    if (this.orchestratorWs && this.isConnected) {
      try {
        this.orchestratorWs.send(JSON.stringify(data))
        console.log(`Sent ${data.type} to orchestrator: ${data.market}`)
      } catch (error) {
        console.error('Failed to send data to orchestrator:', error)
      }
    }
  }
  
  private handleOrchestratorMessage(message: any) {
    console.log('Received message from orchestrator:', message)
    
    // Handle any commands from orchestrator
    if (message.type === 'ping') {
      this.sendToOrchestrator({
        type: 'pong',
        underlying: 'SOL',
        market: 'ping-response',
        timestamp: new Date().toISOString()
      })
    }
  }
  
  private scheduleReconnect() {
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval)
    }
    
    this.reconnectInterval = setTimeout(() => {
      console.log('Attempting to reconnect...')
      this.start()
    }, 5000) // Wait 5 seconds before reconnecting
  }
  
  async stop() {
    try {
      if (this.orchestratorWs) {
        this.orchestratorWs.close()
      }
      
      if (this.reconnectInterval) {
        clearTimeout(this.reconnectInterval)
      }
      
      console.log('Solana Adapter stopped')
    } catch (error) {
      console.error('Error stopping Solana Adapter:', error)
    }
  }
}

// Start the adapter
const adapter = new SolanaAdapter()

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down Solana Adapter...')
  await adapter.stop()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('Shutting down Solana Adapter...')
  await adapter.stop()
  process.exit(0)
})

// Start the service
adapter.start().catch(error => {
  console.error('Failed to start Solana Adapter:', error)
  process.exit(1)
})
