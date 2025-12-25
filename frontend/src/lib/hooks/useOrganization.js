import { useDispatch, useSelector } from 'react-redux'
import { fetchOrganizationMembers } from '../features/organization/organizationSlice';

export function useOrganization() {
  const dispatch = useDispatch();
  const { members, loading } = useSelector((s) => s.organization)
  return {
    members,
    loading,
    fetchMembers: () => dispatch(fetchOrganizationMembers()),
  }
  }
  
