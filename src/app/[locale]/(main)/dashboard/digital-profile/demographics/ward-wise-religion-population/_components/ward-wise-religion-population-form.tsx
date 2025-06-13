"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReligionTypeEnum } from "@/server/api/routers/profile/demographics/ward-wise-religion-population.schema";
import type { ReligionType } from "@/server/api/routers/profile/demographics/ward-wise-religion-population.schema";

// Create a schema for the form that matches the backend schema
const formSchema = z.object({
  id: z.string().optional(),
  religionType: ReligionTypeEnum,
  malePopulation: z.coerce.number().int().nonnegative().default(0),
  femalePopulation: z.coerce.number().int().nonnegative().default(0),
  totalPopulation: z.coerce.number().int().nonnegative().default(0),
  percentage: z.coerce.number().nonnegative().optional(),
});

interface ReligionPopulationFormProps {
  editId: string | null;
  onClose: () => void;
  existingData: any[];
}

// Helper function to get religion display names
const getReligionOptions = () => {
  const religionNames: Record<string, string> = {
    HINDU: "हिन्दु",
    BUDDHIST: "बौद्ध",
    KIRANT: "किरात",
    CHRISTIAN: "क्रिश्चियन",
    ISLAM: "इस्लाम",
    NATURE: "प्रकृति",
    BON: "बोन",
    JAIN: "जैन",
    BAHAI: "बहाई",
    SIKH: "सिख",
    OTHER: "अन्य",
  };

  return Object.values(ReligionTypeEnum.Values).map((value) => ({
    value,
    label: religionNames[value] || value,
  }));
};

export default function ReligionPopulationForm({
  editId,
  onClose,
  existingData,
}: ReligionPopulationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utils = api.useContext();
  const religionOptions = getReligionOptions();

  // Get the existing record if editing
  const { data: editingData, isLoading: isLoadingEditData } =
    api.profile.demographics.wardWiseReligionPopulation.getAll.useQuery(
      undefined,
      {
        enabled: !!editId,
      },
    );

  const createMutation =
    api.profile.demographics.wardWiseReligionPopulation.create.useMutation({
      onSuccess: () => {
        toast.success("नयाँ धर्म जनसंख्या डाटा सफलतापूर्वक थपियो");
        utils.profile.demographics.wardWiseReligionPopulation.getAll.invalidate();
        setIsSubmitting(false);
        onClose();
      },
      onError: (error) => {
        toast.error(`त्रुटि: ${error.message}`);
        setIsSubmitting(false);
      },
    });

  const updateMutation =
    api.profile.demographics.wardWiseReligionPopulation.update.useMutation({
      onSuccess: () => {
        toast.success("धर्म जनसंख्या डाटा सफलतापूर्वक अपडेट गरियो");
        utils.profile.demographics.wardWiseReligionPopulation.getAll.invalidate();
        setIsSubmitting(false);
        onClose();
      },
      onError: (error) => {
        toast.error(`त्रुटि: ${error.message}`);
        setIsSubmitting(false);
      },
    });

  // Set up the form with proper default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      religionType: ReligionTypeEnum.Values.HINDU,
      malePopulation: 0,
      femalePopulation: 0,
      totalPopulation: 0,
      percentage: 0,
    },
  });

  // Populate the form when editing
  useEffect(() => {
    if (editId && editingData) {
      const recordToEdit = editingData.find((record) => record.id === editId);
      if (recordToEdit) {
        form.reset({
          id: recordToEdit.id,
          religionType: recordToEdit.religionType as ReligionType,
          malePopulation: recordToEdit.malePopulation || 0,
          femalePopulation: recordToEdit.femalePopulation || 0,
          totalPopulation: recordToEdit.totalPopulation || 0,
          percentage: recordToEdit.percentage || 0,
        });
      }
    }
  }, [editId, editingData, form]);

  // Auto-calculate total population when male or female population changes
  const malePopulation = form.watch("malePopulation");
  const femalePopulation = form.watch("femalePopulation");

  useEffect(() => {
    const total = (malePopulation || 0) + (femalePopulation || 0);
    form.setValue("totalPopulation", total);
  }, [malePopulation, femalePopulation, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    // Check if a record already exists with this religion (for new records)
    if (!editId) {
      const duplicate = existingData.find(
        (item) => item.religionType === values.religionType,
      );
      if (duplicate) {
        toast.error(`${values.religionType} धर्मको डाटा पहिले नै अवस्थित छ`);
        setIsSubmitting(false);
        return;
      }
    }

    // Prepare data that matches the backend schema
    const dataToSubmit = {
      id: values.id,
      religionType: values.religionType,
      malePopulation: values.malePopulation,
      femalePopulation: values.femalePopulation,
      totalPopulation: values.totalPopulation,
      percentage: values.percentage,
    };

    if (editId) {
      updateMutation.mutate(dataToSubmit);
    } else {
      createMutation.mutate(dataToSubmit);
    }
  };

  if (editId && isLoadingEditData) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2">डाटा लोड गर्दै...</span>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">धर्म जनसंख्या विवरण</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="religionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>धर्म</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!!editId} // Disable religion selection when editing
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="धर्म चयन गर्नुहोस्" />
                      </SelectTrigger>
                      <SelectContent>
                        {religionOptions.map((religion) => (
                          <SelectItem
                            key={religion.value}
                            value={religion.value}
                          >
                            {religion.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="malePopulation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>पुरुष जनसंख्या</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="पुरुष जनसंख्या"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="femalePopulation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>महिला जनसंख्या</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="महिला जनसंख्या"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalPopulation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>कुल जनसंख्या</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="कुल जनसंख्या"
                      {...field}
                      disabled // Auto-calculated
                      className="bg-muted"
                    />
                  </FormControl>
                  <FormDescription>
                    यो स्वचालित रूपमा गणना गरिन्छ
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>प्रतिशत</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="प्रतिशत"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            रद्द गर्नुहोस्
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {editId ? "अपडेट गर्दै..." : "सेभ गर्दै..."}
              </>
            ) : editId ? (
              "अपडेट गर्नुहोस्"
            ) : (
              "सेभ गर्नुहोस्"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
