import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('Simulation of toy over square table top', () => {

  test('renders tabletop component correctly', () => {
    render(<App />);
    expect(screen.getByText('Add Toy')).toBeInTheDocument();
  })

  test("renders a toy correctly", () => {
    render(<App />);
    expect(screen.getAllByTestId('tile')).toHaveLength(25);
    expect(screen.getByTestId('tile-toy1-00-north')).toBeInTheDocument();
  });

  test("renders error message when direction is not selected", () => {
    render(<App />);
    fireEvent.click(screen.getByText('Add Toy'));
    expect(screen.getByText('Select a Direction')).toBeInTheDocument();
  });

  test("renders error message when same location is selected", () => {
    render(<App />);
    const selectDirection = screen.getByTestId('select-direction');
    fireEvent.change(selectDirection, { target: { value: 'north' } });
    fireEvent.click(screen.getByText('Add Toy'));
    expect(screen.getByText('Some toy exists in this position')).toBeInTheDocument();
  });

  test("renders new toy in new position", async () => {
    render(<App />);
    const row = screen.getByTestId('input-row');
    fireEvent.change(row, { target: { value: '0' } });
    const column = screen.getByTestId('input-column');
    fireEvent.change(column, { target: { value: '1' } });
    const selectDirection = screen.getByTestId('select-direction');
    fireEvent.change(selectDirection, { target: { value: 'north' } });
    fireEvent.click(screen.getByText('Add Toy'));
    expect(await screen.findByTestId('tile-toy2-01-north')).toBeInTheDocument();
  });

  test("renders toy rotation correctly", async () => {
    render(<App />);
    const selectRotate = screen.getByTestId('select-rotate');
    fireEvent.change(selectRotate, { target: { value: 'east' } });
    expect(await screen.findByTestId('tile-toy1-00-east')).toBeInTheDocument();
  });

  test("renders toy rotation and movement correctly", async () => {
    render(<App />);
    const selectRotate = screen.getByTestId('select-rotate');
    fireEvent.change(selectRotate, { target: { value: 'east' } });
    expect(await screen.findByTestId('tile-toy1-00-east')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Move'));
    expect(await screen.findByTestId('tile-toy1-01-east')).toBeInTheDocument();
  });

  test("renders error message correctly when toy is going to fall down", async () => {
    render(<App />);
    const selectRotate = screen.getByTestId('select-rotate');
    fireEvent.change(selectRotate, { target: { value: 'east' } });
    expect(await screen.findByTestId('tile-toy1-00-east')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Move'));
    fireEvent.click(screen.getByText('Move'));
    fireEvent.click(screen.getByText('Move'));
    fireEvent.click(screen.getByText('Move'));
    fireEvent.click(screen.getByText('Move'));
    fireEvent.click(screen.getByText('Move'));
    expect(screen.getByText('Toy will fall down')).toBeInTheDocument();
  });
})