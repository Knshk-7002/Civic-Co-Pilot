import { useState } from "react";
import { Link } from "wouter";
import { useListSchemes, getListSchemesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, Filter, Plus, ExternalLink, ShieldCheck, Landmark } from "lucide-react";

export default function SchemesList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const queryParams = {
    ...(search && { search }),
    ...(category !== "all" && { category }),
  };

  const { data: schemes, isLoading } = useListSchemes(queryParams, {
    query: {
      queryKey: getListSchemesQueryKey(queryParams),
    }
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Government Welfare Schemes</h2>
          <p className="text-slate-500 mt-1">Directory of official district, state, and central welfare programs.</p>
        </div>
        <Link href="/schemes/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Scheme
          </Button>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search schemes by name, description, tags..." 
            className="pl-9 bg-slate-50 border-slate-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-slate-50">
              <Filter className="w-4 h-4 mr-2 text-slate-400" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Sanitation">Sanitation</SelectItem>
              <SelectItem value="Road">Roads & Infra</SelectItem>
              <SelectItem value="Water">Water Supply</SelectItem>
              <SelectItem value="Electricity">Electricity</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !schemes || schemes.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 text-slate-500 border border-dashed border-slate-300 rounded-lg bg-slate-50">
          <Landmark className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No schemes found</h3>
          <p className="text-sm mt-1">Try adjusting your search criteria or add a new scheme.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {schemes.map((scheme) => (
            <Card key={scheme.id} className="flex flex-col shadow-sm border-slate-200 hover:border-slate-300 transition-colors overflow-hidden">
              <div className="h-1 bg-primary w-full"></div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="font-medium bg-slate-100 text-slate-700 hover:bg-slate-100">
                    {scheme.category}
                  </Badge>
                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                </div>
                <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                  {scheme.title}
                </CardTitle>
                {scheme.ministry && (
                  <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">
                    {scheme.ministry}
                  </p>
                )}
              </CardHeader>
              <CardContent className="flex-1 pb-4">
                <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                  {scheme.description}
                </p>
                
                {scheme.eligibility && (
                  <div className="bg-slate-50 rounded p-3 mt-4 border border-slate-100">
                    <h5 className="text-xs font-semibold text-slate-900 mb-1">Eligibility</h5>
                    <p className="text-xs text-slate-600 line-clamp-2">{scheme.eligibility}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex gap-2">
                  {scheme.tags?.split(',').slice(0, 2).map((tag, i) => (
                    <span key={i} className="text-[10px] bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
                <a 
                  href={scheme.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Official Portal <ExternalLink className="ml-1 w-3.5 h-3.5" />
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
