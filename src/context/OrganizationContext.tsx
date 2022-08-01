import feathersClient from 'client';
import React, { createContext, ReactNode } from 'react';
import { FC } from 'react';

interface IOrganization {
  id: string;
  name: string;
  telegramGroup: string;
  discord: string;
  website: string;
  description: string;
  pfp: string;
  backgroundColor: string;
  admins: string;
}

type IOrganizationNew = Omit<IOrganization, 'id'>;

interface IOrganizationResponse {
  data: IOrganization[];
  limit: number;
  total: number;
  skip: number;
}

export interface IOrganizationContext {
  organizations: Array<IOrganization>;
  setOrganizations?: React.Dispatch<React.SetStateAction<IOrganization[]>>;
  addOrganization?: (organization: IOrganizationNew) => void;
  removeOrganization: (organizationId: number) => void;
  initializeOrganizations: () => void;
}

export const OrganizationContext = createContext<IOrganizationContext>({
  organizations: [],
  setOrganizations: () => {},
  addOrganization: (organization: IOrganizationNew) => {},
  removeOrganization: (organizationId: number) => {},
  initializeOrganizations: () => {},
});

export const OrganizationProvider: FC<{ children: ReactNode }> = props => {
  const [organizations, setOrganizations] = React.useState<IOrganization[]>([]);
  const OrganizationService = feathersClient.service('organization');

  function addOrganization(organization: IOrganizationNew) {
    OrganizationService.create(organization);
  }

  function removeOrganization(organizationId: number) {
    OrganizationService.remove(organizationId);
  }

  function fetchOrganizations() {
    OrganizationService.find().then((organizations: IOrganizationResponse) => {
      setOrganizations(organizations.data);
    });
  }

  function initializeOrganizations() {
    fetchOrganizations();
    OrganizationService.on('created', () => {
      fetchOrganizations();
    });

    OrganizationService.on('patched', () => {
      fetchOrganizations();
    });

    OrganizationService.on('removed', () => {
      fetchOrganizations();
    });
  }

  return (
    <OrganizationContext.Provider
      value={{ organizations, setOrganizations, addOrganization, removeOrganization, initializeOrganizations }}
    >
      {props.children}
    </OrganizationContext.Provider>
  );
};
