import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import PropertyDetail from "@/pages/PropertyDetail";
import PropertiesSearch from "@/pages/PropertiesSearch";
import AIPropertiesSearch from "@/pages/AIPropertiesSearch";
import AgentsList from "@/pages/AgentsList";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/properties/:id" component={PropertyDetail} />
      <Route path="/properties/buy" component={PropertiesSearch} />
      <Route path="/properties/rent" component={PropertiesSearch} />
      <Route path="/properties/commercial" component={PropertiesSearch} />
      <Route path="/properties/new-projects" component={PropertiesSearch} />
      <Route path="/agents" component={AgentsList} />
      <Route path="/ai-search" component={AIPropertiesSearch} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
