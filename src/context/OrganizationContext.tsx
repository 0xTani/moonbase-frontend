import feathersClient from 'client';
import React, { createContext, ReactNode } from 'react';
import { FC } from 'react';
import { isIdInArray } from 'src/Types/helpers';

export interface IOrganization {
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

export interface IOrganizationSelected extends IOrganization {
  selected: boolean;
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
  getOrganizationsSelected: (
    userOrganizationsList: number[],
    userSelectedOrganizationsList: number[],
  ) => IOrganizationSelected[];
  adminMode: boolean;
  setAdminMode: (mode: boolean) => void;
}

export const OrganizationContext = createContext<IOrganizationContext>({
  organizations: [],
  setOrganizations: () => {},
  addOrganization: (organization: IOrganizationNew) => {},
  removeOrganization: (organizationId: number) => {},
  initializeOrganizations: () => {},
  getOrganizationsSelected: (userOrganizationsList: number[], userSelectedOrganizationsList: number[]) => [],
  adminMode: false,
  setAdminMode: (mode: boolean) => {},
});

export const OrganizationProvider: FC<{ children: ReactNode }> = props => {
  const [organizations, setOrganizations] = React.useState<IOrganization[]>([]);
  const OrganizationService = feathersClient.service('organization');
  const [adminMode, setAdminModeState] = React.useState<boolean>(true);

  function setAdminMode(mode: boolean) {
    setAdminModeState(mode);
  }

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

  function getOrganizationsSelected(userOrganizationsList: number[], userSelectedOrganizationsList: number[]) {
    const userOrganizations: IOrganizationSelected[] = [];

    organizations.map((og: IOrganization) => {
      if (isIdInArray(parseInt(og.id), userOrganizationsList))
        userOrganizations.push({ ...og, selected: isIdInArray(parseInt(og.id), userSelectedOrganizationsList) });
    });
    return userOrganizations;
  }

  let createdListener: any = null;
  let patchedListener: any = null;
  let removedListener: any = null;

  function initializeOrganizations() {
    fetchOrganizations();

    if (!createdListener)
      createdListener = OrganizationService.on('created', () => {
        fetchOrganizations();
      });
    if (!patchedListener)
      patchedListener = OrganizationService.on('patched', () => {
        fetchOrganizations();
      });
    if (!removedListener)
      removedListener = OrganizationService.on('removed', () => {
        fetchOrganizations();
      });
  }

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        setOrganizations,
        addOrganization,
        removeOrganization,
        initializeOrganizations,
        getOrganizationsSelected,
        adminMode,
        setAdminMode,
      }}
    >
      {props.children}
    </OrganizationContext.Provider>
  );
};
