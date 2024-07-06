# SPECIFICATIONS
___
> Target System: Queuing System<br>
> Document Version: 0.00
___

## The Purpose of the System

The purpose of the system is to provide an interface that will organize the queue of clients to the different offices.

## The Users' Needs

There are 2 types of target end users of this system:

* **Clients** are the ones who will be guided by the system as they avail services. They will be given queue numbers or ID tags (whichever is available) that are also input into the system upon entry in the premises.
* **Users** are the ones who provide services to clients. They shall input the queue numbers or ID tag numbers of clients into the system and assign them to the queues of the different offices. They shall be provided with regular and administrative accounts, depending on their required usage.

## What The System Should Be Capable Of

### User Interfaces

The system shall exhibit the following user interfaces:

* **Dashboard** - displays the total number of queues, the online/available queues, the number of clients waiting in the queues, and the number of queues currently entertaining clients.
* **Queue Manager** - allows a user to do the following:
  * create new queues
  * set a queue as a gate queue (where a client goes to upon arriving and before leaving the premises)
  * enter a queue to manage
  * retrieve client numbers
  * reassign retrieved client numbers to other queues
  * leave a managed queue
  * delete an offline/unmanaged queue
* **Queue Screen** - shows the client numbers on queue and the queues currently entertaining clients. This screen will also show the current time and date and may optionally show advertisements.
* **Settings** - allows the user to manipulate various user and system settings.

### User Authentication ###

The system shall allow existing users to authenticate using their username and password. The password shall be stored in hashed form. Once authentication during sign-in is successful, the system shall provide the user session with a unique session ID, which should expire in a set timeout, unless a user has entered/is managing a queue or timeout is non-positive.

### Default Settings

The system shall have the following default settings:

* **System Settings:**
* **User Settings:**
  * Session Timeout: 30 minutes

### Log Events

The system shall log the following events:

* User sign-in and sign-out
* Enqueuing, dequeuing, and requeuing of clients
* Adding, editing, and deleting user accounts (including a user's own account)
* 