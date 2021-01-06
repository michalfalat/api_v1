export type EmailTemplates = {
  verifyEmail: {
    name: string;
    verifyToken: string;
  };
};

type TemplateType = keyof EmailTemplates;

export type EmailTemplate<T extends TemplateType> = {
  template: T;
  params: EmailTemplates[T];
  lang: string;
  to: string;
};
