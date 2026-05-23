import React from 'react';
import { FormProvider as HookFormProvider } from 'react-hook-form';

export const FormProvider = ({ children, methods, onSubmit, ...props }) => {
  return (
    <HookFormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} {...props}>
        {children}
      </form>
    </HookFormProvider>
  );
};
