# Communication Models in TypeScript

This document explains how to implement different communication models in TypeScript, specifically for concurrent programming:

## Current Implementation: Message Passing

The current implementation uses direct message passing between workers and the main thread.
This is a simple form of communication but lacks structure for complex systems.

## CSP (Communicating Sequential Processes)

CSP is a formal language for describing patterns of interaction in concurrent systems. 
It focuses on **channels** as first-class entities for communication.

Key concepts:
- Processes that run independently
- Channels that connect processes
- Communication through synchronized operations on channels

## Actor Model

The Actor model is a mathematical model of concurrent computation where "actors" are the universal primitives.

Key concepts:
- Actors as the basic unit of computation
- Each actor has a mailbox for receiving messages
- Actors process messages sequentially but asynchronously
- Actors can create more actors, send messages, and determine behavior for the next message

## Comparison

| Aspect | CSP | Actor Model |
|--------|-----|-------------|
| Core Unit | Processes | Actors |
| Communication | Through channels | Direct messaging |
| State | Shared via channels | Encapsulated within actors |
| Concurrency | Channel operations synchronize | Message processing is async |
| Error handling | Often via supervisors | Built-in supervision hierarchies |
| Scalability | Good for local concurrency | Excellent for distributed systems |
