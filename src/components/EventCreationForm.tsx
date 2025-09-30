import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Calendar, Clock, MapPin, Users, DollarSign, Image as ImageIcon, Star, Sparkles, ArrowRight, Plus, Trash2, Upload, CircleAlert as AlertCircle, CircleCheck as CheckCircle, X, CircleHelp as HelpCircle, Ticket, FolderInput as FormInput, Mail, FileText, Eye, EyeOff, Package } from "lucide-react";
import { eventCreationSchema, EventCreationFormData } from "@/lib/eventValidation";
import { 
  DEFAULT_FAQ_ITEMS, 
  DEFAULT_TICKET_TYPES, 
  DEFAULT_ORDER_FORM_FIELDS, 
  DEFAULT_SPECIAL_INSTRUCTIONS,
  DEFAULT_CONFIRMATION_MESSAGE,
  DEFAULT_CONFIRMATION_EMAIL,
  EventDraft,
  FaqItem,
  TicketType,
  OrderFormField,
  ImageRef
} from "@/types/eventCreation";
import { uploadImageToStorage, validateImageFile, formatFileSize } from "@/lib/imageUpload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ModuleBuilder } from "@/components/ModuleBuilder";
import { EventModule } from "@/types/customModules";

export const EventCreationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<string[]>([]);
  const [customModules, setCustomModules] = useState<EventModule[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<EventCreationFormData>({
    resolver: zodResolver(eventCreationSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      overview: "",
      location: "",
      startDate: "",
      endDate: "",
      primaryEventDate: "",
      images: {
        main: null,
        gallery: []
      },
      faq: DEFAULT_FAQ_ITEMS,
      tickets: DEFAULT_TICKET_TYPES,
      orderForm: DEFAULT_ORDER_FORM_FIELDS,
      specialInstructions: DEFAULT_SPECIAL_INSTRUCTIONS,
      confirmationPageMessage: DEFAULT_CONFIRMATION_MESSAGE,
      confirmationEmail: DEFAULT_CONFIRMATION_EMAIL,
      hashtags: []
    }
  });

  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
    control: form.control,
    name: "faq"
  });

  const { fields: ticketFields, append: appendTicket, remove: removeTicket } = useFieldArray({
    control: form.control,
    name: "tickets"
  });

  const { fields: orderFormFields, append: appendOrderField, remove: removeOrderField } = useFieldArray({
    control: form.control,
    name: "orderForm"
  });

  const handleImageUpload = async (file: File, type: 'main' | 'gallery') => {
    const uploadId = `${type}-${Date.now()}`;
    setUploadingImages(prev => [...prev, uploadId]);

    try {
      const result = await uploadImageToStorage(file);
      
      if (result.success && result.data) {
        if (type === 'main') {
          form.setValue('images.main', result.data);
        } else {
          const currentGallery = form.getValues('images.gallery') || [];
          form.setValue('images.gallery', [...currentGallery, result.data]);
        }
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(result.error || "Failed to upload image");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploadingImages(prev => prev.filter(id => id !== uploadId));
    }
  };

  const removeImage = (type: 'main' | 'gallery', index?: number) => {
    if (type === 'main') {
      form.setValue('images.main', null);
    } else if (index !== undefined) {
      const currentGallery = form.getValues('images.gallery') || [];
      const newGallery = currentGallery.filter((_, i) => i !== index);
      form.setValue('images.gallery', newGallery);
    }
  };

  const onSubmit = async (data: EventCreationFormData) => {
    if (!user) {
      toast.error("Please sign in to create an event");
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .insert({
          organizer_id: user.id,
          title: data.title,
          short_description: data.shortDescription,
          overview: data.overview,
          location: data.location,
          start_date: data.startDate,
          end_date: data.endDate,
          primary_event_date: data.primaryEventDate,
          main_image_url: data.images.main?.url,
          gallery_images: data.images.gallery,
          confirmation_message: data.confirmationPageMessage,
          confirmation_email: data.confirmationEmail,
          hashtags: data.hashtags,
          status: 'draft'
        })
        .select()
        .single();

      if (eventError) throw eventError;

      const eventId = eventData.id;

      if (data.faq.length > 0) {
        const { error: faqError } = await supabase
          .from('faq_items')
          .insert(
            data.faq.map((item, index) => ({
              event_id: eventId,
              question: item.question,
              answer: item.answer,
              sort_order: index
            }))
          );

        if (faqError) throw faqError;
      }

      if (data.tickets.length > 0) {
        const { error: ticketsError } = await supabase
          .from('ticket_types')
          .insert(
            data.tickets.map((ticket, index) => ({
              event_id: eventId,
              name: ticket.name,
              description: ticket.description,
              price: ticket.price,
              fee: ticket.fee,
              quantity_per_order: ticket.quantityPerOrder,
              is_active: ticket.active,
              sort_order: index
            }))
          );

        if (ticketsError) throw ticketsError;
      }

      if (customModules.length > 0) {
        for (const module of customModules) {
          const { data: moduleData, error: moduleError } = await supabase
            .from('event_modules')
            .insert({
              event_id: eventId,
              module_type: module.module_type,
              module_name: module.module_name,
              module_icon: module.module_icon,
              module_image_url: module.module_image_url,
              module_description: module.module_description,
              sort_order: module.sort_order,
              is_active: module.is_active
            })
            .select()
            .single();

          if (moduleError) throw moduleError;

          if (module.fields.length > 0) {
            const { error: fieldsError } = await supabase
              .from('module_fields')
              .insert(
                module.fields.map((field, index) => ({
                  module_id: moduleData.id,
                  field_key: field.field_key,
                  field_type: field.field_type,
                  field_label: field.field_label,
                  field_placeholder: field.field_placeholder,
                  field_options: field.field_options,
                  is_required: field.is_required,
                  sort_order: index,
                  validation_rules: field.validation_rules
                }))
              );

            if (fieldsError) throw fieldsError;
          }
        }
      }

      toast.success("Event created successfully!");
      navigate("/events");
    } catch (error: any) {
      toast.error(error.message || "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold">Ready to Create Your Event?</h2>
          <p className="text-xl text-muted-foreground">
            Sign in to start creating amazing events that people will love to attend.
          </p>
          <Button size="lg" className="rounded-full" onClick={() => navigate("/auth")}>
            Sign In to Create Event
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-20">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-lg font-medium text-primary">Create Your Event</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold">
            Build Your Perfect Event
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create a comprehensive event with all the details your attendees need.
          </p>
        </div>

        {/* Event Creation Form */}
        <Card className="bg-gradient-card border-0 shadow-soft">
          <CardContent className="p-0">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs defaultValue="basics" className="w-full">
                <TabsList className="grid w-full grid-cols-8">
                  <TabsTrigger value="basics">Event Basics</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                  <TabsTrigger value="faq">FAQ</TabsTrigger>
                  <TabsTrigger value="tickets">Tickets</TabsTrigger>
                  <TabsTrigger value="modules">Custom Modules</TabsTrigger>
                  <TabsTrigger value="orderform">Order Form</TabsTrigger>
                  <TabsTrigger value="confirmation">Confirmation</TabsTrigger>
                  <TabsTrigger value="email">Email</TabsTrigger>
                </TabsList>

                {/* Event Basics Tab */}
                <TabsContent value="basics" className="p-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Event Information
                    </h3>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-base font-medium">
                          Event Title *
                        </Label>
                        <Input
                          {...form.register("title")}
                          placeholder="e.g., 1ER Medio Maratón de Zirahuén 2025"
                          className="h-12"
                        />
                        {form.formState.errors.title && (
                          <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-base font-medium">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          Location *
                        </Label>
                        <Input
                          {...form.register("location")}
                          placeholder="e.g., Zirahuén, Michoacán"
                          className="h-12"
                        />
                        {form.formState.errors.location && (
                          <p className="text-sm text-red-600">{form.formState.errors.location.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shortDescription" className="text-base font-medium">
                        Short Description *
                      </Label>
                      <Textarea
                        {...form.register("shortDescription")}
                        placeholder="Brief description for event listings..."
                        className="min-h-20 resize-none"
                        maxLength={280}
                      />
                      <p className="text-sm text-muted-foreground">
                        {form.watch("shortDescription")?.length || 0}/280 characters
                      </p>
                      {form.formState.errors.shortDescription && (
                        <p className="text-sm text-red-600">{form.formState.errors.shortDescription.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="overview" className="text-base font-medium">
                        Overview *
                      </Label>
                      <RichTextEditor
                        value={form.watch("overview") || ""}
                        onChange={(value) => form.setValue("overview", value)}
                        placeholder="Detailed marketing copy describing your event..."
                        maxLength={5000}
                      />
                      {form.formState.errors.overview && (
                        <p className="text-sm text-red-600">{form.formState.errors.overview.message}</p>
                      )}
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="startDate" className="text-base font-medium">
                          Start Date *
                        </Label>
                        <Input
                          {...form.register("startDate")}
                          type="date"
                          className="h-12"
                        />
                        {form.formState.errors.startDate && (
                          <p className="text-sm text-red-600">{form.formState.errors.startDate.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="endDate" className="text-base font-medium">
                          End Date *
                        </Label>
                        <Input
                          {...form.register("endDate")}
                          type="date"
                          className="h-12"
                        />
                        {form.formState.errors.endDate && (
                          <p className="text-sm text-red-600">{form.formState.errors.endDate.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="primaryEventDate" className="text-base font-medium">
                          Primary Event Date *
                        </Label>
                        <Input
                          {...form.register("primaryEventDate")}
                          type="date"
                          className="h-12"
                        />
                        {form.formState.errors.primaryEventDate && (
                          <p className="text-sm text-red-600">{form.formState.errors.primaryEventDate.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Media Tab */}
                <TabsContent value="media" className="p-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-primary" />
                      Event Images
                    </h3>
                    
                    {/* Main Image */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Main Image *</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        {form.watch("images.main") ? (
                          <div className="relative">
                            <img
                              src={form.watch("images.main")?.url}
                              alt="Main event image"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => removeImage('main')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">Upload main event image</p>
                            <p className="text-sm text-gray-500 mb-4">
                              Recommended: 2160×1080px, Max: 10MB, JPEG/PNG
                            </p>
                            <input
                              type="file"
                              accept="image/jpeg,image/png"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(file, 'main');
                              }}
                              className="hidden"
                              id="main-image-upload"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('main-image-upload')?.click()}
                              disabled={uploadingImages.some(id => id.startsWith('main'))}
                            >
                              {uploadingImages.some(id => id.startsWith('main')) ? 'Uploading...' : 'Choose Image'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Gallery Images */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Additional Images (Optional)</Label>
                      <div className="grid gap-4 md:grid-cols-3">
                        {form.watch("images.gallery")?.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image.url}
                              alt={`Gallery image ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => removeImage('gallery', index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        
                        {(!form.watch("images.gallery") || form.watch("images.gallery")?.length < 3) && (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
                            <div className="text-center">
                              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <input
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleImageUpload(file, 'gallery');
                                }}
                                className="hidden"
                                id="gallery-image-upload"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById('gallery-image-upload')?.click()}
                                disabled={uploadingImages.some(id => id.startsWith('gallery'))}
                              >
                                {uploadingImages.some(id => id.startsWith('gallery')) ? 'Uploading...' : 'Add Image'}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* FAQ Tab */}
                <TabsContent value="faq" className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-primary" />
                        Frequently Asked Questions
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendFaq({ question: "", answer: "" })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add FAQ
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {faqFields.map((field, index) => (
                        <Card key={field.id} className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">FAQ Item {index + 1}</h4>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFaq(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Question *</Label>
                              <Input
                                {...form.register(`faq.${index}.question`)}
                                placeholder="Enter the question..."
                              />
                              {form.formState.errors.faq?.[index]?.question && (
                                <p className="text-sm text-red-600">
                                  {form.formState.errors.faq[index]?.question?.message}
                                </p>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Answer *</Label>
                              <RichTextEditor
                                value={form.watch(`faq.${index}.answer`) || ""}
                                onChange={(value) => form.setValue(`faq.${index}.answer`, value)}
                                placeholder="Enter the answer..."
                                maxLength={1000}
                              />
                              {form.formState.errors.faq?.[index]?.answer && (
                                <p className="text-sm text-red-600">
                                  {form.formState.errors.faq[index]?.answer?.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Tickets Tab */}
                <TabsContent value="tickets" className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <Ticket className="h-5 w-5 text-primary" />
                        Ticket Types
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendTicket({
                          name: "",
                          price: 0,
                          fee: 0,
                          quantityPerOrder: 1,
                          description: "",
                          active: true
                        })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Ticket Type
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {ticketFields.map((field, index) => (
                        <Card key={field.id} className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">Ticket Type {index + 1}</h4>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={form.watch(`tickets.${index}.active`)}
                                  onCheckedChange={(checked) => form.setValue(`tickets.${index}.active`, checked)}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeTicket(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label>Name *</Label>
                                <Input
                                  {...form.register(`tickets.${index}.name`)}
                                  placeholder="e.g., Medio Maratón (21 km)"
                                />
                                {form.formState.errors.tickets?.[index]?.name && (
                                  <p className="text-sm text-red-600">
                                    {form.formState.errors.tickets[index]?.name?.message}
                                  </p>
                                )}
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Price (MXN) *</Label>
                                <Input
                                  {...form.register(`tickets.${index}.price`, { valueAsNumber: true })}
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="550"
                                />
                                {form.formState.errors.tickets?.[index]?.price && (
                                  <p className="text-sm text-red-600">
                                    {form.formState.errors.tickets[index]?.price?.message}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label>Fee (MXN)</Label>
                                <Input
                                  {...form.register(`tickets.${index}.fee`, { valueAsNumber: true })}
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="0"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Quantity per Order *</Label>
                                <Input
                                  {...form.register(`tickets.${index}.quantityPerOrder`, { valueAsNumber: true })}
                                  type="number"
                                  min="1"
                                  placeholder="1"
                                />
                                {form.formState.errors.tickets?.[index]?.quantityPerOrder && (
                                  <p className="text-sm text-red-600">
                                    {form.formState.errors.tickets[index]?.quantityPerOrder?.message}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Description *</Label>
                              <Textarea
                                {...form.register(`tickets.${index}.description`)}
                                placeholder="Describe what's included in this ticket..."
                                className="min-h-20"
                              />
                              {form.formState.errors.tickets?.[index]?.description && (
                                <p className="text-sm text-red-600">
                                  {form.formState.errors.tickets[index]?.description?.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Custom Modules Tab */}
                <TabsContent value="modules" className="p-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      Custom Modules
                    </h3>

                    <p className="text-muted-foreground">
                      Add predefined modules like Tickets, Transportation, and Hospitality, or create custom modules
                      with your own fields. Each module can include images and custom field types.
                    </p>

                    <ModuleBuilder
                      modules={customModules}
                      onChange={setCustomModules}
                    />
                  </div>
                </TabsContent>

                {/* Order Form Tab */}
                <TabsContent value="orderform" className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <FormInput className="h-5 w-5 text-primary" />
                        Order Form Fields
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendOrderField({
                          key: "",
                          type: "string",
                          required: false,
                          label: "",
                          placeholder: ""
                        })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Field
                      </Button>
                    </div>
                    
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Registration is individual per runner. If you need transport/lodging help, mention it so we can assist. 
                        If you suffer from a condition or chronic illness, please notify us.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-4">
                      {orderFormFields.map((field, index) => (
                        <Card key={field.id} className="p-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">Field {index + 1}</h4>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeOrderField(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label>Field Key *</Label>
                                <Input
                                  {...form.register(`orderForm.${index}.key`)}
                                  placeholder="e.g., name, age, email"
                                />
                                {form.formState.errors.orderForm?.[index]?.key && (
                                  <p className="text-sm text-red-600">
                                    {form.formState.errors.orderForm[index]?.key?.message}
                                  </p>
                                )}
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Field Type *</Label>
                                <Select
                                  value={form.watch(`orderForm.${index}.type`)}
                                  onValueChange={(value) => form.setValue(`orderForm.${index}.type`, value as any)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="string">Text</SelectItem>
                                    <SelectItem value="number">Number</SelectItem>
                                    <SelectItem value="boolean">Yes/No</SelectItem>
                                    <SelectItem value="text">Long Text</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Field Label *</Label>
                              <Input
                                {...form.register(`orderForm.${index}.label`)}
                                placeholder="e.g., Full Name, Age, Email Address"
                              />
                              {form.formState.errors.orderForm?.[index]?.label && (
                                <p className="text-sm text-red-600">
                                  {form.formState.errors.orderForm[index]?.label?.message}
                                </p>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Placeholder (Optional)</Label>
                              <Input
                                {...form.register(`orderForm.${index}.placeholder`)}
                                placeholder="e.g., Enter your full name..."
                              />
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={form.watch(`orderForm.${index}.required`)}
                                onCheckedChange={(checked) => form.setValue(`orderForm.${index}.required`, checked)}
                              />
                              <Label>Required field</Label>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Confirmation Tab */}
                <TabsContent value="confirmation" className="p-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Confirmation Page
                    </h3>
                    
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Confirmation page message must be plain text only (no emojis, HTML tags, or special characters).
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmationPageMessage" className="text-base font-medium">
                        Confirmation Page Message *
                      </Label>
                      <Textarea
                        {...form.register("confirmationPageMessage")}
                        placeholder="Enter the message shown to users after successful registration..."
                        className="min-h-32"
                        maxLength={500}
                      />
                      <p className="text-sm text-muted-foreground">
                        {form.watch("confirmationPageMessage")?.length || 0}/500 characters
                      </p>
                      {form.formState.errors.confirmationPageMessage && (
                        <p className="text-sm text-red-600">{form.formState.errors.confirmationPageMessage.message}</p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Email Tab */}
                <TabsContent value="email" className="p-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      Confirmation Email Template
                    </h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="confirmationEmail.from" className="text-base font-medium">
                          From Email *
                        </Label>
                        <Input
                          {...form.register("confirmationEmail.from")}
                          type="email"
                          placeholder="Guardiianes@gmail.com"
                        />
                        {form.formState.errors.confirmationEmail?.from && (
                          <p className="text-sm text-red-600">{form.formState.errors.confirmationEmail.from.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmationEmail.subject" className="text-base font-medium">
                          Subject *
                        </Label>
                        <Input
                          {...form.register("confirmationEmail.subject")}
                          placeholder="Registro confirmado"
                        />
                        {form.formState.errors.confirmationEmail?.subject && (
                          <p className="text-sm text-red-600">{form.formState.errors.confirmationEmail.subject.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmationEmail.htmlBody" className="text-base font-medium">
                        Email Body (HTML) *
                      </Label>
                      <Textarea
                        {...form.register("confirmationEmail.htmlBody")}
                        placeholder="Enter the HTML email template..."
                        className="min-h-64 font-mono text-sm"
                      />
                      <p className="text-sm text-muted-foreground">
                        Available variables: {`{{attendee_name}}, {{event_title}}, {{primary_event_date}}, {{kit_pickup_date}}, {{kit_pickup_location}}, {{location}}, {{ticket_name}}`}
                      </p>
                      {form.formState.errors.confirmationEmail?.htmlBody && (
                        <p className="text-sm text-red-600">{form.formState.errors.confirmationEmail.htmlBody.message}</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 p-6 border-t">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 h-14 text-lg rounded-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Creating Event..."
                  ) : (
                    <>
                      <Plus className="mr-2 h-5 w-5" />
                      Create Event
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-14 text-lg rounded-full px-8"
                  onClick={() => navigate("/events")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};