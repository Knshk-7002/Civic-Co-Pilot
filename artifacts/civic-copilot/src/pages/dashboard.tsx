import { useGetComplaintStats, getGetComplaintStatsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle2, Clock, Inbox, FileText, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: stats, isLoading, isError } = useGetComplaintStats({
    query: {
      queryKey: getGetComplaintStatsQueryKey(),
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <p>Failed to load dashboard statistics. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">District Overview</h2>
        <p className="text-slate-500 mt-2">Real-time statistics on citizen complaints and activity.</p>
      </div>

      {/* Top Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Complaints</CardTitle>
            <Inbox className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
            <p className="text-xs text-slate-500 mt-1">
              {stats.recentCount} in the last 7 days
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending Action</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.pending}</div>
            <p className="text-xs text-amber-600 mt-1 font-medium">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">In Review</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.inReview}</div>
            <p className="text-xs text-slate-500 mt-1">
              Currently being processed
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">High Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.highPriority}</div>
            <p className="text-xs text-destructive mt-1 font-medium">
              Urgent & High severity
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Breakdown Chart Area */}
        <Card className="col-span-4 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Complaints by Category</CardTitle>
            <CardDescription>Distribution of issues across district departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.byCategory.map((cat, i) => {
                const percentage = stats.total > 0 ? Math.round((cat.count / stats.total) * 100) : 0;
                return (
                  <div key={i} className="flex items-center">
                    <div className="w-32 text-sm font-medium text-slate-700 truncate">{cat.category}</div>
                    <div className="flex-1 ml-4">
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-16 text-right text-sm text-slate-500 ml-4 font-mono">{cat.count}</div>
                  </div>
                );
              })}
              
              {stats.byCategory.length === 0 && (
                <div className="py-8 text-center text-slate-500 text-sm">
                  No data available for categories.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resolution Rate & Quick Actions */}
        <div className="col-span-3 space-y-6 flex flex-col">
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Resolution Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-6 pb-8">
                <div className="relative h-40 w-40 rounded-full border-8 border-slate-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900">
                      {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                    </div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">Resolved</div>
                  </div>
                  <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-green-500"
                      strokeDasharray={`${stats.total > 0 ? (stats.resolved / stats.total) * 289 : 0} 289`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex justify-between text-sm pt-4 border-t border-slate-100">
                <div className="flex items-center text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  <span>{stats.resolved} Resolved</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <span>{stats.rejected} Rejected</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="flex-1 shadow-sm border-slate-200 bg-slate-50 flex flex-col justify-center">
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-900 mb-2">Needs Action</h3>
              <p className="text-sm text-slate-500 mb-6">
                You have {stats.pending} complaints waiting for initial review and assignment.
              </p>
              <Link href="/complaints?status=pending" className="inline-flex w-full">
                <div className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-4 rounded-md flex items-center justify-center font-medium transition-colors shadow-sm cursor-pointer">
                  Process Pending Complaints
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
