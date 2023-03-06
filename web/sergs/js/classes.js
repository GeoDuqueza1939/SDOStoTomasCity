"use strict";

class Type
{
    static checkIfCorrectNonEmptyType(data, typeName)
    {
        return data !== undefined
            && data !== null
            && data.__proto__ !== undefined
            && data.__proto__ !== null
            && data.__proto__.constructor !== undefined
            && data.__proto__.constructor !== null
            && data.__proto__.constructor.name !== undefined
            && data.__proto__.constructor.name !== null
            && data.__proto__.constructor.name === typeName;
    }
}

class ArraySet // Custom status class methods for performing set operations on arrays
{
    static intersect(array1, array2, fn = undefined)
    {
        /*
        // [1,2,3] INTERSECT [2,4,1]:
        [1,2,3].filter((val1, index1, arr1) => {
            return ([2,4,1].filter((val2, index2, arr2) => {
                return (val1 == val2);
            }).length > 0);
        });
        // OUTPUT: [1,2]

        // [2,4,1] INTERSECT [1,2,3]:
        [2,4,1].filter((val1, index1, arr1) => {
            return ([1,2,3].filter((val2, index2, arr2) => {
                return (val1 == val2);
            }).length > 0);
        });
        // OUTPUT: [2,1]
        */

        return array1.filter((val1, index1, arr1) => {
            return (array2.filter((val2, index2, arr2) => {
                return (fn === undefined ? val1 == val2 : fn(val1, val2));
            }).length > 0);
        });
    }

    static minus(array1, array2, fn = undefined)
    {
        /*
        // [1,2,3] MINUS [2,4,1]:
        [1,2,3].filter((val1, index1, arr1) => {
            return ([2,4,1].filter((val2, index2, arr2) => {
                return (val1 == val2);
            }).length == 0);
        });
        // OUTPUT: [3]

        // [2,4,1] MINUS [1,2,3]:
        [2,4,1].filter((val1, index1, arr1) => {
            return ([1,2,3].filter((val2, index2, arr2) => {
                return (val1 == val2);
            }).length == 0);
        });
        // OUTPUT: [4]
        */

        return array1.filter((val1, index1, arr1) => {
            return (array2.filter((val2, index2, arr2) => {
                return (fn === undefined ? val1 == val2 : fn(val1, val2));
            }).length == 0);
        });
    }
    
    static union(array1, array2, fn = undefined)
    {
        /*
        // [1,2,3] UNION [2,4,1]:
        [1,2,3].concat([2,4,1].filter((val1, index1, arr1) => {
            return ([1,2,3].filter((val2, index2, arr2) => {
                return (val1 == val2);
            }).length == 0);
        }));
        // OUTPUT: [1,2,3,4]
        */

        return array1.concat(ArraySet.minus(array2, array1, fn));
    }
}

class Person
{
    constructor()
    {
        this.id = -1;
        this.lastName = "";
        this.firstName = "";
        this.middleName = "";
        this.extName = "";
        this.birthday = null; // Date
        this.birthplace = null; // Date
    }

    toJSON()
    {
        return {
            id:this.id,
            lastName:this.lastName,
            firstName:this.firstName,
            middleName:this.middleName,
            extName:this.extName,
            birthday:this.birthday,
            birthplace:this.birthplace,
        };
    }
};
  
class Employee extends Person
{
    constructor()
    {
        super();
        this.employeeId = ""; // may initially use item number specified in Appointment form; may be updated later once an Employee number is assigned
        this.termOfService = []; // TermOfService[]
    }

    toJSON()
    {
        return {
            id:this.id,
            lastName:this.lastName,
            firstName:this.firstName,
            middleName:this.middleName,
            extName:this.extName,
            birthday:this.birthday,
            birthplace:this.birthplace,
            employeeId:this.employeeId,
            termOfService:this.termOfService
        };
    }
};

class User extends Employee
{  
    constructor()
    {
        this.username = ""; // this should be UNIQUE
        this.password = "";
        this.accessLevel = -1; /// Level of system access
    }

    toJSON()
    {
        return {
            id:this.id,
            lastName:this.lastName,
            firstName:this.firstName,
            middleName:this.middleName,
            extName:this.extName,
            birthday:this.birthday,
            birthplace:this.birthplace,
            employeeId:this.employeeId,
            termOfService:this.termOfService,
            username:this.username,
            password:this.password,
            accessLevel:this.accessLevel
        };
    }
};

class LocationType // WILL FUNCTION AS AN ENUM
{
    constructor()
    {
        this.id = -1;
        this.name = "";
    }
};

class Location
{
    constructor()
    {
        this.id = -1;
        this.name = "";
        this.type = null; // LocationType Enum
        this.coordinates = null; /// GPS Coordinates (OPTIONAL property)
        this.broadLocation = []; // Location; index 0 will be preferred unless preference is specified
        this.locationIndeces = []
    }

    getAddress (locationIndeces = null)
    {
        var broadLocationStr = "";

        if (this.broadLocation.length > 0)
        {
            if (locationIndeces !== undefined && locationIndeces !== null && locationIndeces.length > 0 && this.broadLocation.length > locationIndeces[0])
            {
                broadLocationStr = this.broadLocation[locationIndeces[0]].getAddress(locationIndeces.slice(1));
            }
            else
            {
                broadLocationStr = this.broadLocation[0].getAddress();
            }
        }

        return this.name + (broadLocationStr.length == 0 ? "" : ", " + broadLocationStr);
    }

    toJSON()
    {
        return {
            id:this.id,
            name:this.name,
            type:this.type,
            coordinates:this.coordinates,
            broadLocation:this.broadLocation
        }
    }
};
    
class Institution
{
    constructor()
    {
        this.id = -1;
        this.name = "";
        this.umbrellaInstitution = null; // Institution
        this.address = null; // Location
        this.locationIndeces = []; // int
    }

    getAddress ()
    {
        return this.institution.name + (this.address !== null ? ", " + this.address.getAddress(this.locationIndeces) : "");
    }
};

class Workplace
{
    constructor()
    {
        this.institution = null; // Institution
        this.location = null; // Location
        this.locationIndeces = []; // int
        
    }

    getAddress ()
    {
        return this.institution.name + (this.location !== null ? ", " + this.location.getAddress(this.locationIndeces) : "");
    }
};

class Leave
{
    constructor(start, end)
    {
        this.id = -1;
        this.start = start; // Date (inclusive)
        this.end = end; // Date (inclusive)
        this.datesExcluded = []; // Date[]; signifies non-workdays (e.g., holidays, weekends, days offs, etc.)
        this.datesWithPay = []; // Date[]
        // this.datesCoveredByServiceCredit = []; // Date[] // VERIFY IF THIS IS NECESSARY // TEACHERS CAN CONVERT SERVICE CREDIT INTO LEAVE CREDITS ANYTIME, SO THIS IS NOT NECESSARY
    }

    areDateRangesValid()
    {
        // check if any of the excluded dates are included among the supposedly with paid leave dates
        return (ArraySet.intersect(this.datesExcluded, this.datesWithPay, (a, b) => a.toString() === b.toString()).length == 0) && Type.checkIfCorrectNonEmptyType(this.start, "Date") && Type.checkIfCorrectNonEmptyType(this.end, "Date");
    }

    initializeDatesWithPay()
    {
        this.datesWithPay = this.getDates();
    }

    getDates()
    {
        var dateList = [];
        var date = this.start;
        var end = new Date(this.end.valueOf() + 1000 * 60 * 60 * 24); // day after end of leave

        if (this.areDateRangesValid())
        {
            while (Type.checkIfCorrectNonEmptyType(date, "Date") && Type.checkIfCorrectNonEmptyType(end, "Date") && date.toString() !== end.toString())
            {
                // check if every excluded date is not the same as the pointed date
                if (this.datesExcluded.every(val => (val.toString() != date.toString())))
                {
                    dateList.push(date);
                }
                date = new Date(date.valueOf() + 1000 * 60 * 60 * 24); // day after the pointed date.
            }
        }
        else
        {
            throw `ERROR: Please check the validity of the date ranges set. [Common date(s): ${ArraySet.intersect(this.datesExcluded, this.datesWithPay, (a, b) => a.toString() == b.toString())}]`;
        }

        return dateList;
    }

    getDatesWithoutPay()
    {
        return ArraySet.minus(this.getDates(), this.datesWithPay, (a, b) => a.toString() === b.toString());
    }

    addDateToExcluded(year, month, date, shouldExtendDateRange = false) // MONTH IS ZERO-BASED!!!
    {   // ALSO ADD LOGIC FOR EXTENDING DATE RANGE WHEN DATE BEING ADDED IS OUT OF BOUNDS
        this.datesWithPay = ArraySet.minus(this.datesWithPay, [new Date(year, month, date)], (a, b) => a.toString() === b.toString());
        this.datesExcluded = ArraySet.union(this.datesExcluded, [new Date(year, month, date)], (a, b) => a.toString() === b.toString());
    }

    addDateWithPay(year, month, date, shouldExtendDateRange = false) // MONTH IS ZERO-BASED!!!
    {   // ALSO ADD LOGIC FOR EXTENDING DATE RANGE WHEN DATE BEING ADDED IS OUT OF BOUNDS
        this.datesExcluded = ArraySet.minus(this.datesExcluded, [new Date(year, month, date)], (a, b) => a.toString() === b.toString());
        this.datesWithPay = ArraySet.union(this.datesWithPay, [new Date(year, month, date)], (a, b) => a.toString() === b.toString());
    }
}

class Appointment
{
    constructor()
    {
        this.id = -1;
        this.plantillaItem = ""; // this will represent the plantilla item no.
        this.designation = "";
    }
}

class TermOfService
{
    constructor()
    {
        this.id = -1;
        this.start = null; // Date
        this.end = null; // Date
        this.appointment = null; // Appointment
        this.workplace = null; // Workplace
        this.status = null; // Status Enum
        this.salary = -1; // may be updated
        this.leavesTaken = []; // Leave[]
        this.branch = "NM"; // FIXED VALUE FOR NOW
    }
}

class ServiceRecord // autogenerated
{
    constructor()
    {
        this.id = -1;
        this.employee = null; // Employee
        this.lastUpdated = null; // Date
        this.lastCertified = null; // Date
        this.lastApproved = null; // Date
        this.lastReleased = null; // Date
        this.requester = null; // User
        this.encodingStaff = []; // User[] // user/staff that handled the request after the request as been made
        this.certifyingStaff = null; // User
        this.approvingStaff = null; // User
        this.releasingStaff = null; // User
        this.isInitiatedOnline = false; // when user/employee initially requested the document online
        this.isManualRequest = false; // when user/employee had to go onsite to request
        this.isManualEncode = false; // when user/employee had to go onsite to request update
        this.isManualEncodeOverride = false; // when a user/employee that is normally outside the usual scope and normal authorization of the system; NEEDS OVERRIDING PASSCODES AND/OR PROCEDURES (TBA)
        this.isManualCertification = false; // when a user/employee requests a printout to be signed/countersigned by signatories
        this.isManualRelease = false; // when a user/employee needs to go onsite to receive the Service Record
    }
}
