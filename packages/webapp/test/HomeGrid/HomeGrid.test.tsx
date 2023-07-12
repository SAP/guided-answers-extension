import React from 'react';
import { render, screen } from '@testing-library/react';
import { HomeGrid } from '../../src/webview/ui/components/HomeGrid';

describe('<HomeGrid />', () => {
    it('Should render a HomeGrid component, one item', async () => {
        const { container } = render(
            <HomeGrid>
                <div>one</div>
            </HomeGrid>
        );
        const columns = container.getElementsByClassName('guided-answer__home-grid__column');

        expect(container.firstChild).toHaveClass('guided-answer__home-grid');
        expect(columns[0].children.length).toBe(1);
        expect(columns[1].children.length).toBe(0);
    });

    it('Should render a HomeGrid component, three items', async () => {
        const { container } = render(
            <HomeGrid>
                <div>one</div>
                <div>two</div>
                <div>three</div>
            </HomeGrid>
        );
        const columns = container.getElementsByClassName('guided-answer__home-grid__column');

        expect(container.firstChild).toHaveClass('guided-answer__home-grid');
        expect(columns[0].children.length).toBe(2);
        expect(columns[1].children.length).toBe(1);
    });

    it('Should render a HomeGrid component, five items', async () => {
        const { container } = render(
            <HomeGrid>
                <div>one</div>
                <div>two</div>
                <div>three</div>
                <div>four</div>
                <div>five</div>
            </HomeGrid>
        );
        const columns = container.getElementsByClassName('guided-answer__home-grid__column');

        expect(container.firstChild).toHaveClass('guided-answer__home-grid');
        expect(columns[0].children.length).toBe(3);
        expect(columns[1].children.length).toBe(2);
    });
});
