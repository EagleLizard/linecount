using System;
using System.Text.RegularExpressions;
using System.Collections.Generic;

namespace WackyWidget{

  public static class Util{

    private static Regex validNameRx = new Regex(@"^[A-Z]{1}[0-9a-zA-Z]*$");

    public static bool ValidateName(string name){
      string[] names = name.Split(' ');
      if(names.Length<1 || names.Length > 5){
        return false;
      }
      for(int i=0; i < names.Length; ++i){
        if(!validNameRx.IsMatch(names[i].Trim())){
          return false;
        }
      }

      return true;
    }

    public static Employee EmployeeFromPrefix(string prefix, string name){
      switch(prefix){
        case "P":
          return new President(name);
        case "V":
          return new VicePresident(name);
        case "S":
          return new Supervisor(name);
        case "W":
          return new Worker(name);
        default:
          throw new OrgException("Invalid prefix");
      }
    }

    public static Employee VacantEmployee(EmpRole position){
      Employee vacantEmp = EmployeeFromRole(position, "");
      vacantEmp.Vacant = true;
      return vacantEmp;
    }

    public static Employee EmployeeFromRole(EmpRole role, string name){
      return EmployeeFromPrefix(PrefixFromRole(role), name);
    }

    public static string GetRoleString(EmpRole role){
      string result = null;
      switch(role){
        case EmpRole.President:
          result = "President";
          break;
        case EmpRole.Supervisor:
          result = "Supervisor";
          break;
        case EmpRole.VicePresident:
          result = "Vice President";
          break;
        case EmpRole.Worker:
          result = "Worker";
          break;
      }
      return result;
    }

    public static EmpRole RoleFromPrefix(string prefix){
      switch(prefix){
        case "P":
          return EmpRole.President;
        case "V":
          return EmpRole.VicePresident;
        case "S":
          return EmpRole.Supervisor;
        case "W":
          return EmpRole.Worker;
        default:
          throw new OrgException("Invalid prefix");
      }
    }

    public static string PrefixFromRole(EmpRole role){
      switch(role){
        case EmpRole.President:
          return "P";
        case EmpRole.VicePresident:
          return "V";
        case EmpRole.Supervisor:
          return "S";
        case EmpRole.Worker:
          return "W";
        default:
          throw new OrgException("Invalid prefix");
      }
    }

    //gets the value of the most direct subordinate.
    // Returns null if emprole is worker
    public static EmpRole DirectSubordinate(EmpRole bossRole){
      switch(bossRole){
        case EmpRole.President:
          return EmpRole.VicePresident;
        case EmpRole.VicePresident:
          return EmpRole.Supervisor;
        case EmpRole.Supervisor:
          return EmpRole.Worker;
        case EmpRole.Worker:
        default:
          break;
      }
      return EmpRole.Invalid;
    }

    public static bool CanFire(Employee boss, Employee firee){
      return (Org.GetEmployeeByNameHelper(boss, firee.Name) != null);
    }

    public static bool HasVacancy(Employee emp){
      if(emp.Position == EmpRole.Worker){
        return false;
      }
      if(emp.Subordinates.Count < emp.MaxSubordinates){
        return true;
      }
      foreach(Employee sub in emp.Subordinates){
        if(sub.Vacant){
          return true;
        }
      }
      return false;
    }

    public static bool IsABoss(Employee bossMaybe, Employee subMaybe){
      return (int)bossMaybe.Position < (int)subMaybe.Position;
    }

    public static bool CanHire(EmpRole bossRole, EmpRole hireRole){
      //presidents can never be hired
      if(hireRole == EmpRole.President){
        return false;
      }
      switch(bossRole){
        case EmpRole.President:
          return true;
        case EmpRole.VicePresident:
          if(hireRole == EmpRole.Supervisor || hireRole == EmpRole.Worker){
            return true;
          }
          break;
        case EmpRole.Supervisor:
          if(hireRole == EmpRole.Worker){
            return true;
          }
          break;
        case EmpRole.Worker:
        default:
          break;
      }
      return false;
    }

    public static bool HasAnySubordinatesHelper(Employee currentEmployee){
      bool recurseResult;
      //base
      //if the current employee has no subordinates, return false
      if(!currentEmployee.HasSubordinates()) return false;
      //if the current employee is a worker, return false
      if(currentEmployee.Position == EmpRole.Worker) return false;
      //otherwise traverse their subordinates
      for(int i=0; i<currentEmployee.Subordinates.Count; ++i){
        recurseResult = HasAnySubordinatesHelper(currentEmployee.Subordinates[i]);
        if(recurseResult){
          return true;
        }
      }
      return false;
    }

    public static bool CanTransfer(Employee boss, Employee toTransfer){
      switch(boss.Position){
        case EmpRole.President:
        case EmpRole.VicePresident:
          return CanFire(boss, toTransfer);
        default:
          return false;
      }
    }

    public static bool CanPromote(Employee boss, Employee toPromote){

      if(!CanFire(boss, toPromote)) return false;
      switch(boss.Position){
        case EmpRole.President:
          if(toPromote.Position != EmpRole.Supervisor){
            return false;
          }
          break;
        case EmpRole.VicePresident:
          if(toPromote.Position != EmpRole.Worker){
            return false;
          }
          break;
        default:
          return false;
      }
      //make sure boss has a vacancy in his direct org
      if(boss.HasOpening()){
        return true;
      }
      return false;
    }

    public static void SwapEmployees(Employee transferer, Employee emp1, Employee emp2){
      Employee parent1 = Org.GetParentHelper(transferer, emp1);
      Employee parent2 = Org.GetParentHelper(transferer, emp2);
      int emp1Idx = parent1.Subordinates.IndexOf(emp1);
      int emp2Idx = parent2.Subordinates.IndexOf(emp2);
      Employee tempEmp = emp1;
      EmpRole tempRole = emp1.Position;
      emp1.Position = emp2.Position;
      emp2.Position = tempRole;
      List<Employee> tempSubs = emp1.Subordinates;
      emp1.Subordinates = emp2.Subordinates;
      emp2.Subordinates = tempSubs;
      parent1.Subordinates[emp1Idx] = emp2;
      parent2.Subordinates[emp2Idx] = tempEmp;
      // string tempName = emp1._Name;
      // bool tempVacant = emp1.Vacant;
      //
      // emp1._Name = emp2._Name;
      // emp1.Vacant = emp2.Vacant;
      // emp2._Name = tempName;
      // emp2.Vacant = tempVacant;

    }

  }

}
