import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AccountExpense {
  id: string;
  name: string;
  type: 'api' | 'license' | 'subscription';
  provider: string;
  amount: number;
  dueDate: string;
  status: 'active' | 'pending' | 'expired';
  details: {
    accountId?: string;
    apiKey?: string;
    licenseKey?: string;
    subscriptionTier?: string;
    renewalDate?: string;
    usageLimit?: string;
    currentUsage?: string;
  };
}

interface AccountGroup {
  provider: string;
  accounts: AccountExpense[];
  totalMonthly: number;
}

const initialAccountGroups: AccountGroup[] = [
  {
    provider: 'Google',
    totalMonthly: 2450,
    accounts: [
      {
        id: 'g1',
        name: 'Google Cloud Platform',
        type: 'api',
        provider: 'Google',
        amount: 1200,
        dueDate: '2024-04-15',
        status: 'active',
        details: {
          accountId: 'gcp-main-123',
          apiKey: '****YZ89',
          usageLimit: '1000000 calls/month',
          currentUsage: '654321 calls'
        }
      },
      {
        id: 'g2',
        name: 'Google Workspace Enterprise',
        type: 'license',
        provider: 'Google',
        amount: 750,
        dueDate: '2024-04-01',
        status: 'active',
        details: {
          licenseKey: '****ABCD',
          renewalDate: '2025-04-01'
        }
      },
      {
        id: 'g3',
        name: 'Google Maps API',
        type: 'api',
        provider: 'Google',
        amount: 500,
        dueDate: '2024-04-15',
        status: 'active',
        details: {
          apiKey: '****XY12',
          usageLimit: '100000 requests/month',
          currentUsage: '73421 requests'
        }
      }
    ]
  },
  {
    provider: 'Microsoft',
    totalMonthly: 1850,
    accounts: [
      {
        id: 'm1',
        name: 'Azure Cloud Services',
        type: 'api',
        provider: 'Microsoft',
        amount: 1000,
        dueDate: '2024-04-10',
        status: 'active',
        details: {
          accountId: 'azure-prod-456',
          apiKey: '****7890',
          usageLimit: 'Pay as you go',
          currentUsage: '78% of forecast'
        }
      },
      {
        id: 'm2',
        name: 'Microsoft 365 E5',
        type: 'license',
        provider: 'Microsoft',
        amount: 850,
        dueDate: '2024-04-05',
        status: 'active',
        details: {
          licenseKey: '****EFGH',
          renewalDate: '2025-04-05'
        }
      }
    ]
  },
  {
    provider: 'OpenAI',
    totalMonthly: 3200,
    accounts: [
      {
        id: 'o1',
        name: 'GPT-4 API',
        type: 'api',
        provider: 'OpenAI',
        amount: 2000,
        dueDate: '2024-04-20',
        status: 'active',
        details: {
          apiKey: '****UV34',
          usageLimit: 'Pay as you go',
          currentUsage: '1.2M tokens/day'
        }
      },
      {
        id: 'o2',
        name: 'DALL-E API',
        type: 'api',
        provider: 'OpenAI',
        amount: 1200,
        dueDate: '2024-04-20',
        status: 'active',
        details: {
          apiKey: '****WX56',
          usageLimit: 'Pay as you go',
          currentUsage: '15k images/month'
        }
      }
    ]
  }
];

const AccountsSection: React.FC = () => {
  const [accountGroups, setAccountGroups] = useState<AccountGroup[]>(initialAccountGroups);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const sortedGroups = [...accountGroups].sort((a, b) => a.provider.localeCompare(b.provider));

  return (
    <div className="space-y-6">
      {/* Provider Selection Dropdown */}
      <div className="w-64">
        <select
          className="w-full bg-black/20 border border-ferrari-red/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-ferrari-red/50"
          value={selectedProvider || ''}
          onChange={(e) => setSelectedProvider(e.target.value || null)}
        >
          <option value="">All Providers</option>
          {sortedGroups.map((group) => (
            <option key={group.provider} value={group.provider}>
              {group.provider} (${group.totalMonthly}/month)
            </option>
          ))}
        </select>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-3 gap-4">
        {(selectedProvider
          ? sortedGroups.filter(group => group.provider === selectedProvider)
          : sortedGroups
        ).map((group) => (
          <motion.div
            key={group.provider}
            className="bg-black/20 rounded-lg p-4 border border-ferrari-red/10"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{group.provider}</h3>
              <div className="text-sm text-gray-400">
                ${group.totalMonthly}/month
              </div>
            </div>
            
            <div className="space-y-3">
              {group.accounts.map((account) => (
                <motion.div
                  key={account.id}
                  className="bg-black/40 rounded-lg p-3 cursor-pointer hover:bg-black/60"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{account.name}</div>
                    <div className={`px-2 py-0.5 rounded-full text-xs ${
                      account.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      account.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {account.status}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-400">{account.type.toUpperCase()}</div>
                    <div>${account.amount}/month</div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Due: {new Date(account.dueDate).toLocaleDateString()}
                  </div>
                  
                  <motion.div
                    className="mt-3 pt-3 border-t border-ferrari-red/10"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                  >
                    <div className="space-y-2 text-sm">
                      {Object.entries(account.details).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-400">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AccountsSection; 