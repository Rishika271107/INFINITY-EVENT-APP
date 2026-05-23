import React, { createContext, useContext } from 'react';
import { useForm, FormProvider as RHFFormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Create a context to expose form methods for child components
const FormContext = createContext(null);

export const useCustomForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useCustomForm must be used within a FormProvider');
  }
  return context;
};

/**
 * FormProvider sets up react-hook-form with a Zod schema resolver.
 * Props:
 * - schema: Zod schema for validation
 * - defaultValues: optional default values object
 * - onSubmit: async function handling valid data
 * - children: form inputs and submit button
 */
export const FormProvider = ({ schema, defaultValues = {}, onSubmit, children }) => {
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onBlur',
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    try {
      await onSubmit(data);
    } catch (err) {
      // Allow individual forms to handle errors as needed
      console.error('Form submission error:', err);
    }
  });

  return (
    <FormContext.Provider value={methods}>
      <RHFFormProvider {...methods}>
        <form onSubmit={handleSubmit} noValidate>
          {children}
        </form>
      </RHFFormProvider>
    </FormContext.Provider>
  );
};
