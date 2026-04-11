import React from 'react';
import { Flex, HStack, Text, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, to, active }) => {
  return (
    <Link as={RouterLink} to={to} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        px={4}
        py={2.5}
        borderRadius="lg"
        bg={active ? 'brand.50' : 'transparent'}
        color={active ? 'brand.600' : 'gray.700'}
        _hover={{
          bg: active ? 'brand.100' : 'gray.100',
          color: active ? 'brand.700' : 'gray.900',
        }}
        transition="all 0.2s"
      >
        <HStack spacing={3}>
          <Icon size={20} />
          <Text fontSize="sm" fontWeight={active ? 'semibold' : 'medium'}>
            {label}
          </Text>
        </HStack>
      </Flex>
    </Link>
  );
};

export default SidebarItem;