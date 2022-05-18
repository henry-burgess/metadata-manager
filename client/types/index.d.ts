// Types for incrementally creating a new sample.
// A new type is declared for each step.
declare namespace Create {
  type Start = {
    name: string;
    created: string;
    owner: string;
    project: { name: string; id: string };
    description: string;
  };

  type Associations = Start & {
    projects: { name: string; id: string }[];
    associations: {
      origin: { name: string; id: string };
      products: { name: string; id: string }[];
    };
  };

  type Parameters = Associations & {
    parameters: ParameterProps[];
  };
}

export type ParameterStruct = {
  name: string;
  description: string;
  type: "sample" | "number" | "data";
  attributes?: {
    name: string;
    type: "number" | "file" | "url" | "string";
    data: number | string;
  }[];
};

export type ParameterModel = ParameterStruct & {
  _id: string;
};

declare type ParameterProps = ParameterStruct & {
  identifier: string;
  dataCallback?: (data: ParameterProps) => void;
  removeCallback?: (identifier: string) => void;
};

declare type ParameterGroupProps = {
  parameters: ParameterModel[];
  onRemove?: (identifier: string) => void;
  onDataUpdate?: (data: ParameterProps) => void;
};

export type ParameterCardProps = {
  data: ParameterStruct;
};

export type ProjectStruct = {
  name: string;
  description: string;
  attributes: string[];
  associations: {
    samples: string[];
  };
};

export type ProjectModel = ProjectStruct & {
  _id: string;
};

export type SampleStruct = {
  name: string;
  created: string;
  owner: string;
  project: { name: string; id: string };
  description: string;
  projects: { name: string; id: string }[];
  associations: {
    origin: { name: string; id: string };
    products: { name: string; id: string }[];
  };
  parameters: ParameterStruct[];
};

export type SampleModel = SampleStruct & {
  _id: string;
};

declare type LinkyProps = {
  type: "samples" | "projects" | "parameters";
  id: string;
};
