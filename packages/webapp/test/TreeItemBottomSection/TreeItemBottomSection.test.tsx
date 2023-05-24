import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { TreeItemBottomSection } from '../../src/webview/ui/components/TreeItemBottomSection';

describe('<TreeItemBottomSection />', () => {
    it('renders without description, product or component', () => {
        render(<TreeItemBottomSection tree={{}} />);

        const bottomSection = screen.getByTestId('bottom-section');
        expect(bottomSection).toBeInTheDocument();

        const descElement = screen.queryByText(/.+/);
        expect(descElement).not.toBeInTheDocument();

        const productElement = screen.queryByText(/Product: /);
        expect(productElement).not.toBeInTheDocument();

        const componentElement = screen.queryByText(/Component: /);
        expect(componentElement).not.toBeInTheDocument();
    });

    it('renders with a description', () => {
        const mockDescription = 'A sample description';
        render(<TreeItemBottomSection tree={{ DESCRIPTION: mockDescription }} />);

        const descElement = screen.getByText(mockDescription);
        expect(descElement).toBeInTheDocument();
    });
    it('renders with a product', () => {
        const mockProduct = 'Product 1, Product 2';
        render(<TreeItemBottomSection tree={{ PRODUCT: mockProduct }} />);

        const productContainer = screen.getByTestId('product-container');
        expect(productContainer).toBeInTheDocument();

        const productTitle = within(productContainer).getByText((content, node) => {
            const hasText = (node: any) => node.textContent === 'Product: ';
            const nodeHasText = hasText(node);
            //@ts-ignore
            const childrenDontHaveText = Array.from(node.children).every((child) => !hasText(child));
            return nodeHasText && childrenDontHaveText;
        });
        expect(productTitle).toBeInTheDocument();

        const firstProduct = within(productContainer).getByText('Product 1');
        expect(firstProduct).toBeInTheDocument();
    });

    it('renders with a component', () => {
        const mockComponent = 'Component 1, Component 2';
        render(<TreeItemBottomSection tree={{ COMPONENT: mockComponent }} />);

        const componentContainer = screen.getByTestId('component-container');
        expect(componentContainer).toBeInTheDocument();

        const componentTitle = within(componentContainer).getByText((content, node) => {
            const hasText = (node: any) => node.textContent === 'Component: ';
            const nodeHasText = hasText(node);
            //@ts-ignore
            const childrenDontHaveText = Array.from(node.children).every((child) => !hasText(child));
            return nodeHasText && childrenDontHaveText;
        });
        expect(componentTitle).toBeInTheDocument();

        const firstComponent = within(componentContainer).getByText('Component 1');
        expect(firstComponent).toBeInTheDocument();
    });
});
