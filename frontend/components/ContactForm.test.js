import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
render(<ContactForm />);
expect(screen.getByText(/contact form/i)).toBeInTheDocument();
expect(screen.getByLabelText(/First Name\*/i)).toBeVisible();
expect(screen.getByLabelText(/Last Name\*/i)).toBeVisible();
expect(screen.getByLabelText(/Email\*/i)).toBeVisible();
expect(screen.getByLabelText(/Message/i)).toBeVisible();
expect(screen.getAllByRole('textbox').length).toBe(4);
expect(screen.getByRole('button')).toBeVisible();

});

test('renders the contact form header', () => {
    render(<ContactForm />);
    expect(screen.getByText(/contact form/i)).toBeTruthy();
    expect(screen.getByText(/contact form/i)).toBeInTheDocument();
    expect(screen.getByText(/contact form/i)).toHaveTextContent(/Contact Form/);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);
    const nameInput = screen.getByLabelText(/First Name/);
    userEvent.type(nameInput,"R");
    expect(await screen.findByText(/Error: firstName must have at least 5 characters/)).toBeVisible();
    userEvent.type(nameInput,"yan");
    expect(await screen.findByText(/Error: firstName must have at least 5 characters/)).toBeVisible();
    userEvent.type(nameInput,"M");
    expect(await screen.queryByText(/Error: firstName must have at least 5 characters/)).not.toBeInTheDocument();
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    expect(await screen.queryByText(/Error: firstName must have at least 5 characters/)).not.toBeInTheDocument();
    expect(await screen.queryByText(/Error: lastName is a required field/)).not.toBeInTheDocument();
    expect(await screen.queryByText(/Error: email must be a valid email address/)).not.toBeInTheDocument();
    render(<ContactForm />);
    userEvent.click(screen.getByRole('button', {value:/SUBMIT/}));
    expect(await screen.findByText(/Error: firstName must have at least 5 characters/)).toBeVisible();
    expect(await screen.findByText(/Error: lastName is a required field/)).toBeVisible();
    expect(await screen.findByText(/Error: email must be a valid email address/)).toBeVisible();
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);
    userEvent.type(screen.getByLabelText(/First Name/),"RyanM");
    userEvent.type(screen.getByLabelText(/Last Name/),"Magro");
    userEvent.click(screen.getByRole('button', {value: /SUBMIT/}));
    expect(await screen.findByText(/Error: email must be a valid email/)).toBeVisible();
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);
    expect(screen.queryByText(/Error: email must be a valid email address/)).not.toBeInTheDocument();
    userEvent.type(screen.getByLabelText(/Email/),"Magro");
    expect(await screen.findByText(/Error: email must be a valid email/)).toBeVisible();

});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);
    expect(screen.queryByText(/Error: lastName is a required field/)).not.toBeInTheDocument();
    userEvent.type(screen.getByLabelText(/First Name/),"Magro");
    userEvent.type(screen.getByLabelText(/Email/),"Magro@magro.com");
    userEvent.click(screen.getByRole('button', {value: /SUBMIT/}));
    expect(await screen.findByText(/Error: lastName is a required field/)).toBeVisible();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);
    userEvent.type(screen.getByLabelText(/First Name/),"RyanM");
    userEvent.type(screen.getByLabelText(/Last Name/),"Magro");
    userEvent.type(screen.getByLabelText(/Email/),"me@me.com");
    userEvent.click(screen.getByRole('button', {value: /SUBMIT/}));
    await waitFor(() => screen.findByText(/First Name:/));
    expect(await screen.findByText(/First Name:/)).toBeInTheDocument();
    expect(await screen.findByText(/RyanM/)).toBeInTheDocument();
    expect(await screen.findByText(/Last Name:/)).toBeVisible();
    expect(await screen.findByText(/Magro/)).toBeInTheDocument();
    expect(await screen.findByText(/Email:/)).toBeVisible();
    expect(await screen.findByText(/me@me.com/)).toBeInTheDocument();
    expect(await screen.queryByText(/Message:/)).not.toBeInTheDocument();
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />);
    userEvent.type(screen.getByLabelText(/First Name/),"RyanM");
    userEvent.type(screen.getByLabelText(/Last Name/),"Magro");
    userEvent.type(screen.getByLabelText(/Email/),"me@me.com");
    userEvent.type(screen.getByLabelText(/Message/),"Here is the message");
    userEvent.click(screen.getByRole('button', {value: /SUBMIT/}));
    expect(await screen.findByText(/First Name:/)).toBeInTheDocument();
    expect(await screen.findByText(/RyanM/)).toBeInTheDocument();
    expect(await screen.findByText(/Last Name:/)).toBeVisible();
    expect(await screen.findByText(/Magro/)).toBeInTheDocument();
    expect(await screen.findByText(/Email:/)).toBeVisible();
    expect(await screen.findByText(/me@me.com/)).toBeInTheDocument();
    expect(await screen.findByText(/Message:/)).toBeVisible();
    expect(await screen.findByText(/Here is the message/)).toBeInTheDocument();
});
