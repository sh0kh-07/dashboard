import React from 'react';
import { Box, Heading, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  breadcrumbs: string[];
}

const PageHeader = ({ title, breadcrumbs }: PageHeaderProps) => {
  return (
    <Box mb={8}>
      <Breadcrumb spacing="8px" separator={<ChevronRight size={14} color="#718096" />} mb={2}>
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/" color="gray.400" fontSize="xs">Asosiy</BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((bc, idx) => (
          <BreadcrumbItem key={idx} isCurrentPage={idx === breadcrumbs.length - 1}>
            <BreadcrumbLink color={idx === breadcrumbs.length - 1 ? 'brand.500' : 'gray.500'} fontSize="xs">
              {bc}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
      <Heading size="lg">{title}</Heading>
    </Box>
  );
};

export default PageHeader;
