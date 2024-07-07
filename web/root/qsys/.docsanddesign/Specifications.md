# SPECIFICATIONS
___
> Target System: Queuing System<br>
> Document Version: 0.00
___

## The Purpose of the System

The purpose of the system is to provide an interface that will organize the queue of clients to the different offices.

## The Users' Needs

There are 2 types of target end users of this system:

* **Clients** are the ones who will be guided by the system as they avail services. They will be given queue numbers or ID tags (whichever is available) that are also input into the system upon entry in the premises. Clients will also be classified as either regular clients or priority clients (e.g., pregnant, elderly, disabled, etc.).
* **Users** are the ones who provide services to clients. They shall input the queue numbers or ID tag numbers of clients into the system and assign them to the queues of the different offices. They shall join queues as queue managers. They shall be provided with regular and administrator accounts, depending on their required usage. Their most basic usage will be management of queues and the modification of user settings. Administrator accounts can change system-wide settings and manage user accounts.

## What The System Should Be Capable Of

### User Interfaces

The system shall exhibit the following user interfaces:

* **Sign In Screen** - login screen. Buttons or links to the Queue Screen, FAQs, and Terms of Use will be placed here.
* **Dashboard** - displays the total number of queues, the currently online/available queues, the number of clients waiting in the queues, and the number of queues currently entertaining clients.
* **Queue Manager** - allows a user to do the following:
  * create new queues
  * set a queue as a gate queue (where a client goes to upon arriving and before leaving the premises)
  * join a queue as manager
  * view co-managers of a joined queue
  * assign clients to a queue (gate queues only)
  * retrieve client numbers
  * reassign retrieved clients to other queues
  * kick clients from queues and provide a plausible justification for such action
  * leave a managed queue (a queue with no clients or queue managers will go offline)
  * delete an offline/unmanaged queue (only queues without managers or clients can be deleted; when deleting an unmanaged queue with remaining clients, user will be asked for the queue where the remaining clients will be reassigned in bulk; the last queue can only be deleted if it is both unmanaged and void of clients; managed queues can never be deleted)
* **Queue Screen** - shows the client numbers on queue and the queues currently entertaining clients. This screen will also show the current time and date and may optionally show advertisements.
* **Ad Manager** - allows management of displayed/advertised content on the Queue Screen.
* **Settings** - allows the user to manipulate various user and system settings. User management functions, available only to administrator accounts, will also be available in this screen.
* **FAQ**
* **Terms of Use**

### User Authentication ###

The system shall allow existing users to authenticate using their username and password. The password shall be stored in hashed form. Once authentication during sign-in is successful, the system shall provide the user session with a unique session ID, which should expire in a set timeout unless server requests are made within the grace period, a user has joined a queue as a queue manager, or timeout setting is non-positive.

### Default Settings

The system shall have the following default settings:

* **System-Wide Settings:**
  * Ping Interval: 10 seconds
  * Default Session Timeout: 30 minutes
* **User Settings:**
  * Session Timeout: NULL (30 minutes)

### Log Events

The system shall log the following events:

* User sign-in and sign-out
* Enqueuing, dequeuing, and requeuing of clients
* Creating, editing, joining, leaving, and deleting queues
* Adding, editing, and deleting user accounts (including a user's own account)
* Changing user and system settings
