
// custom components
import { Input} from "../components/ui/input";
import { Button} from "../components/ui/button";
import { Modal} from "../components/ui/modal";

// Third party imports
import PhoneInput from "react-phone-input-2";
import { Controller } from "react-hook-form";

// css
import "react-phone-input-2/lib/style.css";

// constants
import { validateEmail } from "@/constants/regExp";

type FormField = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  component?: "input" | "select" | "phone" | "email";
  options?: { value: string; label: string }[];
  validate?: (value: string) => string | boolean;
};

type FormConfig = {
  title: string;
  fields: FormField[];
  defaultValues: Record<string, any>;
  submitButtonText: string;
  loadingText: string;
};

type ReusableModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "lead" | "contact";
  onSubmit: (data: any) => void;
  loading: boolean;
  control: any;
  register: any;
  handleSubmit: any;
  errors: any;
  submitButtonText?: string;
};

const formConfigs: Record<"lead" | "contact", FormConfig> = {
  lead: {
    title: "Add New Lead",
    submitButtonText: "Add Lead",
    loadingText: "Adding...",
    fields: [
      {
        name: "firstName",
        label: "First Name",
        type: "text",
        required: true,
        placeholder: "Enter first name",
        component: "input",
      },
      {
        name: "lastName",
        label: "Last Name",
        type: "text",
        required: true,
        placeholder: "Enter last name",
        component: "input",
      },
      {
        name: "company",
        label: "Company",
        type: "text",
        required: true,
        placeholder: "Enter company name",
        component: "input",
      },
      {
        name: "phoneNumber",
        label: "Phone Number",
        required: true,
        component: "phone",
      },
      {
        name: "title",
        label: "Title",
        type: "text",
        placeholder: "Enter title",
        component: "input",
      },
      {
        name: "leadStatus",
        label: "Lead Status",
        required: true,
        component: "select",
        options: [
          { value: "", label: "Select lead status" },
          { value: "Open - Not Contacted", label: "Open - Not Contacted" },
          { value: "Working - Contacted", label: "Working - Contacted" },
          { value: "Closed - Converted", label: "Closed - Converted" },
          { value: "Closed - Not Converted", label: "Closed - Not Converted" },
        ],
      },
    ],
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      phoneNumber: "",
      title: "",
      leadStatus: "",
    },
  },
  contact: {
    title: "Add New Contact",
    submitButtonText: "Add Contact",
    loadingText: "Adding...",
    fields: [
      {
        name: "firstName",
        label: "First Name",
        type: "text",
        required: true,
        placeholder: "Enter first name",
        component: "input",
      },
      {
        name: "lastName",
        label: "Last Name",
        type: "text",
        required: true,
        placeholder: "Enter last name",
        component: "input",
      },
      {
        name: "phoneNumber",
        label: "Phone Number",
        required: true,
        component: "phone",
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        placeholder: "Enter email address",
        component: "input",
        validate: (value:string) =>{
          if(!validateEmail.test(value)){return "Please enter a valid email"} ;
          return true
        }
      },
    ],
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
    },
  },
};


export const SalesForceModal = ({
  isOpen,
  onClose,
  type,
  onSubmit,
  loading,
  control,
  register,
  handleSubmit,
  errors,
  submitButtonText,
}: ReusableModalProps) => {
  const config = formConfigs[type];

  return (
    <Modal 
      isOpen={isOpen} 
      onCancel={onClose} 
      moduleType={config.title} 
      onOk={handleSubmit(onSubmit)} 
      okButtonClassName={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      cancelButtonClassName="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" 
      okText={submitButtonText} 
      loading={loading} 
      okSubmitText="Adding..."
    >
      <form className="space-y-4">
        {config.fields.map((field) => {
          const validationRules = {
            required: field.required ? `${field.label} is required` : false,
            ...(field.validate && { validate: field.validate }),
            ...(field.type === 'email' && {
              pattern: {
                value: validateEmail,
                message: 'Please enter a valid email address'
              }
            })
          };
  
          return (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
  
              {field.component === "input" && (
                <Input
                  {...register(field.name, validationRules)}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              )}
  
              {field.component === "select" && (
                <select
                  id={field.name}
                  {...register(field.name, validationRules)}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
  
              {field.component === "phone" && (
                <Controller
                  name={field.name}
                  control={control}
                  rules={validationRules}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <div>
                      <PhoneInput
                        country={"us"}
                        enableAreaCodes={true}
                        placeholder="Enter phone number"
                        specialLabel=""
                        containerClass="w-full"
                        inputClass="!w-full !pl-14 !pr-3 !py-2 !border !border-gray-300 dark:!border-gray-600 !rounded-md !shadow-sm !placeholder-gray-400 dark:!placeholder-gray-500 focus:!outline-none focus:!ring-blue-500 focus:!border-blue-500 sm:!text-sm !bg-white dark:!bg-gray-700 !text-gray-900 dark:!text-white"
                        buttonClass="!absolute !left-0 !top-0 !h-full !z-10 !flex !items-center !bg-gray-100 !text-gray-800 dark:!bg-gray-700 dark:!text-gray-200 border-r dark:border-gray-600 hover:!bg-gray-200 dark:!hover:bg-gray-600"
                        dropdownClass="!bg-gray-100 !text-gray-800 dark:!bg-gray-700 dark:!text-gray-200 hove:!bg-gray-200 dark:hover:!bg-gray-600"
                        searchClass="!bg-gray-100 !text-gray-800 dark:!bg-gray-700 dark:!text-gray-200"
                        value={value}
                        onChange={onChange}
                      />
                    </div>
                  )}
                />
              )}
  
              {errors[field.name]?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[field.name]?.message as string}
                </p>
              )}
            </div>
          );
        })}
      </form>
    </Modal>
  );
};