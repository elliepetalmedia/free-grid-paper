import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import FAQ from "@/pages/faq";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/hex-paper" component={Home} />
      <Route path="/music-staff" component={Home} />
      <Route path="/engineering" component={Home} />
      <Route path="/poster-size" component={Home} />
      <Route path="/poster-hex" component={Home} />
      <Route path="/calligraphy" component={Home} />
      <Route path="/knitting" component={Home} />
      <Route path="/graph" component={Home} />
      <Route path="/dot-grid" component={Home} />
      <Route path="/faq" component={FAQ} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
