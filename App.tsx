import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'context/theme_provider';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from 'store';
import MainApp from './src/main_app';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      retry: 3,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider>
            <SafeAreaProvider>
              <MainApp />
            </SafeAreaProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </ReduxProvider>
    </QueryClientProvider>
  );
};

export default App;
