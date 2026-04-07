import React from 'react';
import { HStack, Icon, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  icon: LucideIcon | any;
  label: string;
  to: string;
  active: boolean;
}

const SidebarItem = ({ icon, label, to, active }: SidebarItemProps) => {
  return (
    <Link to={to} style={{ width: '100%' }}>
      <HStack
        w="full"
        px={4}
        py={3}
        cursor="pointer"
        bg={active ? 'brand.500' : 'transparent'}
        color={active ? 'white' : 'gray.400'}
        borderRadius="lg"
        transition="all 0.2s"
        _hover={{
          bg: active ? 'brand.600' : 'whiteAlpha.100',
          color: 'white',
        }}
      >
        <Icon as={icon} size={20} />
        <Text fontWeight="medium" fontSize="sm">{label}</Text>
      </HStack>
    </Link>
  );
};

export default SidebarItem;
