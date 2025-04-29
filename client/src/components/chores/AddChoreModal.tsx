import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { insertChoreSchema, choreCategoryEnum, choreFrequencyEnum } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useHousehold } from "@/hooks/use-household";
import { useChores } from "@/hooks/use-chores";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface AddChoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: Date;
}

export default function AddChoreModal({ isOpen, onClose, initialDate }: AddChoreModalProps) {
  const { toast } = useToast();
  const { currentHousehold } = useHousehold();
  const { createChore, isCreating } = useChores();
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  // Extend the insert schema to create a form schema
  const formSchema = insertChoreSchema.extend({
    dueDate: z.string().min(1, "Due date is required"),
  });

  const today = format(new Date(), "yyyy-MM-dd");
  const initialDueDate = initialDate ? format(initialDate, "yyyy-MM-dd") : today;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "Kitchen",
      estimatedMinutes: 15,
      assignedToId: undefined,
      dueDate: initialDueDate,
      repeatFrequency: "Never",
      householdId: currentHousehold?.household.id || 0,
    },
  });

  useEffect(() => {
    if (currentHousehold) {
      form.setValue("householdId", currentHousehold.household.id);
    }
  }, [currentHousehold, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!currentHousehold) {
      toast({
        title: "No household",
        description: "You need to be in a household to create chores",
        variant: "destructive",
      });
      return;
    }

    try {
      const choreData = {
        ...values,
        dueDate: new Date(values.dueDate),
      };

      await createChore(choreData);
      toast({
        title: "Chore created",
        description: "Your chore has been created successfully",
      });
      form.reset({
        name: "",
        description: "",
        category: "Kitchen",
        estimatedMinutes: 15,
        assignedToId: undefined,
        dueDate: today,
        repeatFrequency: "Never",
        householdId: currentHousehold.household.id,
      });
      handleClose();
    } catch (error: any) {
      toast({
        title: "Failed to create chore",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Chore</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chore Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Vacuum living room" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {choreCategoryEnum.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="estimatedMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Time (min)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 15)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="assignedToId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign To</FormLabel>
                  <Select
                    value={field.value?.toString() || ""}
                    onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select household member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currentHousehold?.members.map((member) => (
                        <SelectItem key={member.id} value={member.id.toString()}>
                          {member.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" min={today} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="repeatFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repeat</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {choreFrequencyEnum.map((frequency) => (
                          <SelectItem key={frequency} value={frequency}>
                            {frequency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any notes or special instructions"
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Chore"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
