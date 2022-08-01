import { OrganizationContext } from 'src/context/OrganizationContext';
import { useContext } from 'react';

export const useOrganization = () => {
  return useContext(OrganizationContext);
};
