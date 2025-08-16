import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Check if the collected_data directory exists
    const dataDir = path.join(process.cwd(), '..', '..', 'services', 'ollama-strategy-engine', 'collected_data')
    
    if (!fs.existsSync(dataDir)) {
      return NextResponse.json({
        bots: {
          mixtral: { status: 'unknown', collections: 0, lastCollection: null, efficiency: { success: 0, total: 0, rate: 0 } },
          'deepseek-r1:8b': { status: 'unknown', collections: 0, lastCollection: null, efficiency: { success: 0, total: 0, rate: 0 } },
          'deepseek-coder:6.7b': { status: 'unknown', collections: 0, lastCollection: null, efficiency: { success: 0, total: 0, rate: 0 } }
        },
        assetClassPerformance: {
          super_influencers: { total: 0, success: 0, rate: 0 },
          options_strategies: { total: 0, success: 0, rate: 0 },
          forex_strategies: { total: 0, success: 0, rate: 0 },
          crypto_strategies: { total: 0, success: 0, rate: 0 }
        },
        latestCollections: []
      })
    }

    // Get ALL collection files for accurate counting
    const files = fs.readdirSync(dataDir)
      .filter(f => f.endsWith('.json'))
      .sort((a, b) => {
        const aPath = path.join(dataDir, a)
        const bPath = path.join(dataDir, b)
        return fs.statSync(bPath).mtime.getTime() - fs.statSync(aPath).mtime.getTime()
      })
    
    // Get latest 5 for display, but process all for counting
    const latestFiles = files.slice(0, 5)

    const latestCollections = []
    const botStats = {
      mixtral: { collections: 0, lastCollection: null, efficiency: { success: 0, total: 0, rate: 0 } },
      'deepseek-r1:8b': { collections: 0, lastCollection: null, efficiency: { success: 0, total: 0, rate: 0 } },
      'deepseek-coder:6.7b': { collections: 0, lastCollection: null, efficiency: { success: 0, total: 0, rate: 0 } }
    }
    
    const assetClassStats = {
      super_influencers: { total: 0, success: 0, rate: 0 },
      options_strategies: { total: 0, success: 0, rate: 0 },
      forex_strategies: { total: 0, success: 0, rate: 0 },
      crypto_strategies: { total: 0, success: 0, rate: 0 }
    }

    // Process each file
    for (const file of files) {
      try {
        const filePath = path.join(dataDir, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        const data = JSON.parse(content)
        
        // Extract collection info
        const collectionInfo = {
          file,
          timestamp: data.collected_at || 'Unknown',
          type: data.collection_type || 'Unknown',
          strategies: 0,
          size: content.length
        }

        // Count strategies based on type
        if (data.options_strategies?.strategies) {
          collectionInfo.strategies += data.options_strategies.strategies.length
        }
        if (data.forex_strategies?.strategies) {
          collectionInfo.strategies += data.forex_strategies.strategies.length
        }
        if (data.crypto_strategies?.strategies) {
          collectionInfo.strategies += data.crypto_strategies.strategies.length
        }
        if (data.super_influencers) {
          collectionInfo.strategies += data.super_influencers.length
        }

        // Only add to latestCollections if it's in the latest 5 files
        if (latestFiles.some(lf => lf === file)) {
          latestCollections.push(collectionInfo)
        }

        // Track asset class performance
        if (data.super_influencers) {
          assetClassStats.super_influencers.total++
          if (data.super_influencers.length > 0) {
            assetClassStats.super_influencers.success++
          }
        }
        if (data.options_strategies) {
          assetClassStats.options_strategies.total++
          if (data.options_strategies.strategies && data.options_strategies.strategies.length > 0) {
            assetClassStats.options_strategies.success++
          }
        }
        if (data.forex_strategies) {
          assetClassStats.forex_strategies.total++
          if (data.forex_strategies.strategies && data.forex_strategies.strategies.length > 0) {
            assetClassStats.forex_strategies.success++
          }
        }
        if (data.crypto_strategies) {
          assetClassStats.crypto_strategies.total++
          if (data.crypto_strategies.strategies && data.crypto_strategies.strategies.length > 0) {
            assetClassStats.crypto_strategies.success++
          }
        }
        
        // Update bot stats based on collection type
        if (data.collection_type === 'scheduled_super_influencers' || data.collection_type === 'scheduled_options') {
          botStats.mixtral.collections++
          botStats.mixtral.efficiency.total++
          if (data.super_influencers || (data.options_strategies && data.options_strategies.strategies)) {
            botStats.mixtral.efficiency.success++
          }
          if (!botStats.mixtral.lastCollection) {
            botStats.mixtral.lastCollection = data.collected_at
          }
        }
        if (data.collection_type === 'scheduled_forex') {
          botStats['deepseek-r1:8b'].collections++
          botStats['deepseek-r1:8b'].efficiency.total++
          if (data.forex_strategies && data.forex_strategies.strategies) {
            botStats['deepseek-r1:8b'].efficiency.success++
          }
          if (!botStats['deepseek-r1:8b'].lastCollection) {
            botStats['deepseek-r1:8b'].lastCollection = data.collected_at
          }
        }
        if (data.collection_type === 'scheduled_crypto') {
          botStats['deepseek-coder:6.7b'].collections++
          botStats['deepseek-coder:6.7b'].efficiency.total++
          if (data.crypto_strategies && data.crypto_strategies.strategies) {
            botStats['deepseek-coder:6.7b'].efficiency.success++
          }
          if (!botStats['deepseek-coder:6.7b'].lastCollection) {
            botStats['deepseek-coder:6.7b'].lastCollection = data.collected_at
          }
        }
        
        // Also check for files without collection_type (older runs)
        if (data.forex_strategies && data.forex_strategies.strategies) {
          botStats['deepseek-r1:8b'].collections++
          botStats['deepseek-r1:8b'].efficiency.total++
          if (data.forex_strategies.strategies.length > 0) {
            botStats['deepseek-r1:8b'].efficiency.success++
          }
        }
        if (data.crypto_strategies && data.crypto_strategies.strategies) {
          botStats['deepseek-coder:6.7b'].collections++
          botStats['deepseek-coder:6.7b'].efficiency.total++
          if (data.crypto_strategies.strategies.length > 0) {
            botStats['deepseek-coder:6.7b'].efficiency.success++
          }
        }
        if (data.options_strategies && data.options_strategies.strategies) {
          botStats.mixtral.collections++
          botStats.mixtral.efficiency.total++
          if (data.options_strategies.strategies.length > 0) {
            botStats.mixtral.efficiency.success++
          }
        }
        if (data.super_influencers) {
          botStats.mixtral.collections++
          botStats.mixtral.efficiency.total++
          if (data.super_influencers.length > 0) {
            botStats.mixtral.efficiency.success++
          }
        }

      } catch (error) {
        console.error(`Error processing file ${file}:`, error)
      }
    }

    // Calculate efficiency rates
    for (const bot of Object.values(botStats)) {
      if (bot.efficiency.total > 0) {
        bot.efficiency.rate = Math.round((bot.efficiency.success / bot.efficiency.total) * 100)
      }
    }
    
    for (const asset of Object.values(assetClassStats)) {
      if (asset.total > 0) {
        asset.rate = Math.round((asset.success / asset.total) * 100)
      }
    }

    // Check bot health (simple ping to Ollama)
    const botHealth = await checkBotHealth()

    return NextResponse.json({
      bots: {
        mixtral: { 
          ...botStats.mixtral, 
          status: botHealth.mixtral ? 'active' : 'down' 
        },
        'deepseek-r1:8b': { 
          ...botStats['deepseek-r1:8b'], 
          status: botHealth['deepseek-r1:8b'] ? 'active' : 'down' 
        },
        'deepseek-coder:6.7b': { 
          ...botStats['deepseek-coder:6.7b'], 
          status: botHealth['deepseek-coder:6.7b'] ? 'active' : 'down' 
        }
      },
      assetClassPerformance: assetClassStats,
      latestCollections
    })

  } catch (error) {
    console.error('Error in bot-status API:', error)
    return NextResponse.json({ error: 'Failed to get bot status' }, { status: 500 })
  }
}

async function checkBotHealth() {
  const health = {
    mixtral: false,
    'deepseek-r1:8b': false,
    'deepseek-coder:6.7b': false
  }

  // Check each bot individually
  const bots = ['mixtral', 'deepseek-r1:8b', 'deepseek-coder:6.7b']
  
  for (const bot of bots) {
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: bot,
          prompt: 'ping',
          stream: false
        }),
        signal: AbortSignal.timeout(3000) // 3 second timeout per bot
      })

      if (response.ok) {
        health[bot] = true
      }
    } catch (error) {
      console.error(`Health check failed for ${bot}:`, error)
      // Individual bot failure doesn't affect others
    }
  }

  return health
}
