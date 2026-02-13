import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StatusProvider } from './contexts/StatusContext.tsx'
import { JobProvider } from './contexts/JobContext.tsx'
import { StatusDataProvider } from './contexts/StatusDataContext.tsx'
import { OverviewDataProvider } from './contexts/OverviewDataContext.tsx'
import { CapacitiesProvider } from './contexts/CapacitiesContext.tsx'
import { UserProvider } from './contexts/UserContext.tsx'
import { CTAProvider } from './contexts/CTAContext.tsx'
import { CardProvider } from './contexts/CardContext.tsx'
import { ReloadProvider } from './contexts/ReloadContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReloadProvider>
      <CTAProvider>
        <CardProvider>
          <UserProvider>
            <JobProvider>
              <CapacitiesProvider>
                <OverviewDataProvider>
                  <StatusDataProvider>
                    <StatusProvider>
                      <App />
                    </StatusProvider>
                  </StatusDataProvider>
                </OverviewDataProvider>
              </CapacitiesProvider>
            </JobProvider>
          </UserProvider>
        </CardProvider>
      </CTAProvider>
    </ReloadProvider>
  </StrictMode>,
)