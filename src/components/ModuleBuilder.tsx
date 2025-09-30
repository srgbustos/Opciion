import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Trash2,
  GripVertical,
  Upload,
  X,
  Ticket,
  Bus,
  Hotel,
  Package,
  Image as ImageIcon
} from "lucide-react";
import { EventModule, ModuleField, ModuleType, PREDEFINED_MODULES, DEFAULT_MODULE_FIELDS } from "@/types/customModules";
import { uploadImageToStorage } from "@/lib/imageUpload";
import { toast } from "sonner";

type ModuleBuilderProps = {
  modules: EventModule[];
  onChange: (modules: EventModule[]) => void;
};

const MODULE_ICONS = {
  Ticket,
  Bus,
  Hotel,
  Package,
};

export const ModuleBuilder = ({ modules, onChange }: ModuleBuilderProps) => {
  const [uploadingModuleId, setUploadingModuleId] = useState<string | null>(null);

  const addPredefinedModule = (type: ModuleType) => {
    const predefined = PREDEFINED_MODULES.find(m => m.module_type === type);
    if (!predefined) return;

    const newModule: EventModule = {
      ...predefined,
      id: `temp-${Date.now()}`,
      sort_order: modules.length,
      fields: DEFAULT_MODULE_FIELDS[type].map(f => ({ ...f })),
    };

    onChange([...modules, newModule]);
  };

  const addCustomModule = () => {
    const newModule: EventModule = {
      id: `temp-${Date.now()}`,
      module_type: 'custom',
      module_name: 'Custom Module',
      module_icon: 'Package',
      module_description: '',
      sort_order: modules.length,
      is_active: true,
      fields: [],
    };

    onChange([...modules, newModule]);
  };

  const updateModule = (moduleId: string, updates: Partial<EventModule>) => {
    onChange(
      modules.map(m =>
        m.id === moduleId ? { ...m, ...updates } : m
      )
    );
  };

  const removeModule = (moduleId: string) => {
    onChange(modules.filter(m => m.id !== moduleId));
  };

  const addField = (moduleId: string) => {
    const newField: ModuleField = {
      field_key: '',
      field_type: 'string',
      field_label: '',
      field_placeholder: '',
      is_required: false,
      sort_order: 0,
    };

    onChange(
      modules.map(m => {
        if (m.id === moduleId) {
          return {
            ...m,
            fields: [...m.fields, newField],
          };
        }
        return m;
      })
    );
  };

  const updateField = (moduleId: string, fieldIndex: number, updates: Partial<ModuleField>) => {
    onChange(
      modules.map(m => {
        if (m.id === moduleId) {
          const newFields = [...m.fields];
          newFields[fieldIndex] = { ...newFields[fieldIndex], ...updates };
          return { ...m, fields: newFields };
        }
        return m;
      })
    );
  };

  const removeField = (moduleId: string, fieldIndex: number) => {
    onChange(
      modules.map(m => {
        if (m.id === moduleId) {
          return {
            ...m,
            fields: m.fields.filter((_, i) => i !== fieldIndex),
          };
        }
        return m;
      })
    );
  };

  const handleModuleImageUpload = async (moduleId: string, file: File) => {
    setUploadingModuleId(moduleId);

    try {
      const result = await uploadImageToStorage(file);

      if (result.success && result.data) {
        updateModule(moduleId, { module_image_url: result.data.url });
        toast.success("Module image uploaded successfully!");
      } else {
        toast.error(result.error || "Failed to upload image");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploadingModuleId(null);
    }
  };

  const existingTypes = modules.map(m => m.module_type);
  const availablePredefined = PREDEFINED_MODULES.filter(
    p => !existingTypes.includes(p.module_type)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {availablePredefined.map((predefined) => {
          const IconComponent = MODULE_ICONS[predefined.module_icon as keyof typeof MODULE_ICONS];
          return (
            <Button
              key={predefined.module_type}
              type="button"
              variant="outline"
              onClick={() => addPredefinedModule(predefined.module_type)}
            >
              {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
              Add {predefined.module_name}
            </Button>
          );
        })}
        <Button
          type="button"
          variant="outline"
          onClick={addCustomModule}
        >
          <Package className="h-4 w-4 mr-2" />
          Add Custom Module
        </Button>
      </div>

      <div className="space-y-4">
        {modules.map((module, moduleIndex) => {
          const IconComponent = MODULE_ICONS[module.module_icon as keyof typeof MODULE_ICONS] || Package;

          return (
            <Card key={module.id} className="p-6">
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <GripVertical className="h-5 w-5 text-muted-foreground mt-2" />
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5 text-primary" />
                        <Input
                          value={module.module_name}
                          onChange={(e) => updateModule(module.id!, { module_name: e.target.value })}
                          placeholder="Module name"
                          className="text-lg font-semibold"
                        />
                      </div>

                      {module.module_type === 'custom' && (
                        <Input
                          value={module.module_description || ''}
                          onChange={(e) => updateModule(module.id!, { module_description: e.target.value })}
                          placeholder="Module description (optional)"
                        />
                      )}

                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        {module.module_image_url ? (
                          <div className="relative">
                            <img
                              src={module.module_image_url}
                              alt={module.module_name}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => updateModule(module.id!, { module_image_url: undefined })}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-2">Add module image (optional)</p>
                            <input
                              type="file"
                              accept="image/jpeg,image/png"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleModuleImageUpload(module.id!, file);
                              }}
                              className="hidden"
                              id={`module-image-${module.id}`}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById(`module-image-${module.id}`)?.click()}
                              disabled={uploadingModuleId === module.id}
                            >
                              {uploadingModuleId === module.id ? 'Uploading...' : 'Choose Image'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={module.is_active}
                      onCheckedChange={(checked) => updateModule(module.id!, { is_active: checked })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeModule(module.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Fields</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addField(module.id!)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Field
                    </Button>
                  </div>

                  {module.fields.map((field, fieldIndex) => (
                    <Card key={fieldIndex} className="p-4 bg-muted/30">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="font-medium">Field {fieldIndex + 1}</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeField(module.id!, fieldIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Field Key</Label>
                            <Input
                              value={field.field_key}
                              onChange={(e) => updateField(module.id!, fieldIndex, { field_key: e.target.value })}
                              placeholder="e.g., room_type, transport_need"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Field Type</Label>
                            <Select
                              value={field.field_type}
                              onValueChange={(value) => updateField(module.id!, fieldIndex, { field_type: value as any })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="string">Text</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="boolean">Yes/No</SelectItem>
                                <SelectItem value="text">Long Text</SelectItem>
                                <SelectItem value="select">Dropdown</SelectItem>
                                <SelectItem value="image">Image Upload</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Field Label</Label>
                            <Input
                              value={field.field_label}
                              onChange={(e) => updateField(module.id!, fieldIndex, { field_label: e.target.value })}
                              placeholder="e.g., Room Type, Transportation Needed"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Placeholder (optional)</Label>
                            <Input
                              value={field.field_placeholder || ''}
                              onChange={(e) => updateField(module.id!, fieldIndex, { field_placeholder: e.target.value })}
                              placeholder="e.g., Enter your preference..."
                            />
                          </div>
                        </div>

                        {field.field_type === 'select' && (
                          <div className="space-y-2">
                            <Label>Options (comma-separated)</Label>
                            <Input
                              value={field.field_options?.join(', ') || ''}
                              onChange={(e) => updateField(module.id!, fieldIndex, {
                                field_options: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                              })}
                              placeholder="e.g., Single Room, Double Room, Suite"
                            />
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={field.is_required}
                            onCheckedChange={(checked) => updateField(module.id!, fieldIndex, { is_required: checked })}
                          />
                          <Label>Required field</Label>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {module.fields.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No fields added yet. Click "Add Field" to create custom fields for this module.
                    </p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}

        {modules.length === 0 && (
          <Card className="p-8">
            <div className="text-center space-y-2">
              <Package className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">
                No modules added yet. Add predefined modules like Tickets, Transportation, or Hospitality,
                or create custom modules with your own fields.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
