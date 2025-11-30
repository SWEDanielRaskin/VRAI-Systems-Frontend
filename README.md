# VRAI Systems Frontend

This project is the frontend dashboard for **VRAI Systems**, a production-ready AI-powered voice receptionist platform designed for healthcare businesses. The dashboard provides real-time monitoring, customer management, appointment tracking, and comprehensive system controls, enabling business owners to manage their AI receptionist with ease.

## Case Study

To visit this product's page on my company website, check out the [case study](https://deltarsystems.com/about/casestudies/vraisystems).

<img width="1400" alt="VRAI Systems Dashboard" src="vrai-systems-screenshot.png">

## Overview

The frontend is a modern, responsive React application that provides a comprehensive administrative dashboard for managing the VRAI Systems AI receptionist. Built with React and Vite, it delivers real-time updates through Server-Sent Events (SSE), ensuring business owners have instant visibility into calls, messages, appointments, and system health.

## Key Features

- **Real-Time Dashboard**: Live system health monitoring with Server-Sent Events (SSE) providing sub-second updates for calls, messages, appointments, and notifications
- **Customer Relationship Management**: Complete customer database with profile pictures, appointment history, inline editing, and search/filter capabilities
- **Appointment Management**: View upcoming and past appointments with detailed information, notes editing, and calendar integration
- **Voice Call Tracking**: Real-time call logs with AI conversation summaries, call duration, and status tracking
- **SMS Message Management**: View all customer messages, conversation threads, and manual SMS sending capabilities
- **Message Template Customization**: Visual drag-and-drop interface for customizing automated SMS templates with dynamic variables
- **System Settings**: Comprehensive configuration panel for business hours, AI behavior, staff management, Google Calendar integration, and theme customization
- **Notification Center**: Real-time notifications for system events, customer interactions, and important alerts
- **Services Manager**: Configure available services, pricing, duration, and specialist assignments
- **Responsive Design**: Fully responsive layout optimized for desktop, tablet, and mobile devices
- **JWT Authentication**: Secure login with token-based authentication and protected routes

## Architecture Highlights

- **Component-Based Architecture**: Modular React components with reusable UI elements and clear separation of concerns
- **Real-Time Updates**: Server-Sent Events (SSE) integration for live dashboard updates without polling
- **Protected Routes**: Route-level authentication with automatic redirects for unauthorized access
- **Context-Based State Management**: React Context API for global authentication state management
- **API Service Layer**: Centralized API service with Axios interceptors for automatic token injection and error handling
- **Modern Build Tooling**: Vite for fast development and optimized production builds
- **Production Deployment**: Netlify deployment with serverless functions and edge network distribution

## Tech Stack

**Frontend Framework**: React 18  
**Build Tool**: Vite  
**Styling**: Tailwind CSS  
**Routing**: React Router v6  
**HTTP Client**: Axios  
**Icons**: Lucide React  
**Charts**: Recharts  
**Date Handling**: date-fns  
**Authentication**: JWT (token-based)  
**Deployment**: Netlify
