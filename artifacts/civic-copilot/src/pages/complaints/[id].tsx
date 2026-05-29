import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { 
  useGetComplaint, 
  getGetComplaintQueryKey, 
  useUpdateComplaint,
  useDeleteComplaint,
  useListSchemes,
  getListSchemesQueryKey,
  ComplaintUpdate
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Loader2, ArrowLeft, ExternalLink, MapPin, User, Mail, Phone, Calendar, AlertCircle, FileText, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const updateSchema = z.object({
  status: z.string().optional(),
  priority: z.string().optional(),
  adminNotes: z.string().optional(),
});

export default function ComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const complaintId = parseInt(id || "0", 10);
  const { toast } = useToast();
  const [, setLocation] = useState(""); // For redirecting after delete, imported from wouter below manually if needed, will use window.location as fallback
  const queryClient = useQueryClient();

  const { data: complaint, isLoading, isError } = useGetComplaint(complaintId, {
    query: {
      enabled: !!complaintId,
      queryKey: getGetComplaintQueryKey(complaintId),
    }
  });

  const { data: recommendedSchemes, isLoading: isLoadingSchemes } = useListSchemes(
    { category: complaint?.category }, 
    {
      query: {
        enabled: !!complaint?.category,
        queryKey: getListSchemesQueryKey({ category: complaint?.category }),
      }
    }
  );

  const updateMutation = useUpdateComplaint();
  const deleteMutation = useDeleteComplaint();

  const form = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      status: "",
      priority: "",
      adminNotes: "",
    },
  });

  // Reset form when complaint data loads
  useEffect(() => {
    if (complaint) {
      form.reset({
        status: complaint.status,
        priority: complaint.priority,
        adminNotes: complaint.adminNotes || "",
      });
    }
  }, [complaint, form]);

  const onSubmit = (data: z.infer<typeof updateSchema>) => {
    updateMutation.mutate({ id: complaintId, data }, {
      onSuccess: (updatedComplaint) => {
        toast({
          title: "Complaint Updated",
          description: "Status and notes have been saved.",
        });
        queryClient.setQueryData(getGetComplaintQueryKey(complaintId), updatedComplaint);
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: "There was an error saving your changes.",
        });
      }
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate({ id: complaintId }, {
      onSuccess: () => {
        toast({
          title: "Complaint Deleted",
          description: "The complaint record has been permanently removed.",
        });
        window.location.href = "/complaints";
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Deletion Failed",
          description: "There was an error deleting this complaint.",
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !complaint) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <p>Complaint not found or you do not have permission to view it.</p>
        </div>
        <Link href="/complaints">
          <Button variant="outline" className="mt-4">Back to Complaints</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex items-center justify-between">
        <Link href="/complaints">
          <Button variant="ghost" className="pl-0 text-slate-500 hover:text-slate-900 hover:bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Registry
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-slate-400">ID: #{complaint.id}</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-destructive-foreground">
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the complaint record and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                  {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Delete Complaint
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <Badge variant="outline" className="mb-2 text-primary border-primary/20 bg-primary/5">{complaint.category}</Badge>
                  <CardTitle className="text-2xl">{complaint.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-slate-700">
                <p className="whitespace-pre-wrap">{complaint.description}</p>
              </div>
              
              <Separator className="my-6" />
              
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center">
                <User className="w-4 h-4 mr-2 text-slate-400" /> Citizen Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500 block text-xs">Name</span>
                  <span className="font-medium text-slate-900">{complaint.citizenName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">Filing Date</span>
                  <span className="text-slate-900 flex items-center mt-1">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    {format(new Date(complaint.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                  </span>
                </div>
                {complaint.citizenEmail && (
                  <div>
                    <span className="text-slate-500 block text-xs">Email</span>
                    <span className="text-slate-900 flex items-center mt-1">
                      <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                      <a href={`mailto:${complaint.citizenEmail}`} className="text-primary hover:underline">{complaint.citizenEmail}</a>
                    </span>
                  </div>
                )}
                {complaint.citizenPhone && (
                  <div>
                    <span className="text-slate-500 block text-xs">Phone</span>
                    <span className="text-slate-900 flex items-center mt-1">
                      <Phone className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                      {complaint.citizenPhone}
                    </span>
                  </div>
                )}
                {complaint.location && (
                  <div className="md:col-span-2">
                    <span className="text-slate-500 block text-xs">Location</span>
                    <span className="text-slate-900 flex items-center mt-1">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                      {complaint.location}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Admin Workflow */}
          <Card className="shadow-sm border-slate-200 bg-slate-50/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileText className="w-5 h-5 mr-2 text-slate-400" /> Official Resolution Workflow
              </CardTitle>
              <CardDescription>Update status and record internal administrative notes.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resolution Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in_review">In Review</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="adminNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Administrative Notes (Internal)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter notes regarding resolution, contacted parties, or next steps..." 
                            className="min-h-[120px] bg-white"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={updateMutation.isPending}>
                      {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Official Record
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200 border-t-4 border-t-primary">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="text-base text-primary">Recommended Govt. Schemes</CardTitle>
              <CardDescription className="text-xs">Based on category: {complaint.category}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingSchemes ? (
                <div className="p-6 flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary/50" />
                </div>
              ) : !recommendedSchemes || recommendedSchemes.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500">
                  No applicable schemes found for this category.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recommendedSchemes.slice(0, 3).map(scheme => (
                    <div key={scheme.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <h4 className="font-medium text-sm text-slate-900 mb-1">{scheme.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{scheme.description}</p>
                      <a 
                        href={scheme.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs font-medium text-primary hover:underline"
                      >
                        View Official Portal <ExternalLink className="ml-1 w-3 h-3" />
                      </a>
                    </div>
                  ))}
                  
                  <div className="p-3 text-center bg-slate-50">
                    <Link href={`/schemes?category=${complaint.category}`} className="text-xs font-medium text-slate-600 hover:text-primary transition-colors">
                      View all related schemes →
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
