import antispam
import requests
import json
import os


# Q1 : Pourquoi êtes-vous là ?
Mquestion1 = antispam.Detector("question1.dat")

# Q2 : Avez-vous de la fièvre ?
Mquestion2 = antispam.Detector("question2.dat")
Mquestion2.train("Oui", True)
Mquestion2.train("Non", False)

# Q3 : Avez-vous eu une prise de poids importante ces 12 derniers mois ?
Mquestion3 = antispam.Detector("question3.dat")
Mquestion3.train("Oui", True)
Mquestion3.train("Non", False)

# Q4 : Avez-vous eu une perte de poids importante ces 12 derniers mois ?
Mquestion4 = antispam.Detector("question4.dat")
Mquestion4.train("Oui", True)
Mquestion4.train("Non", False)

# Q5 : Avez vous une blessure extérieure ?
Mquestion5 = antispam.Detector("question5.dat")
Mquestion5.train("Oui", True)
Mquestion5.train("Non", False)

# Q6 : Depuis quand êtes vous dans cet état ?
Mquestion6 = antispam.Detector("question6.dat")

# Q7 : Avez-vous des pertes d’équilibre ?
Mquestion7 = antispam.Detector("question7.dat")
Mquestion7.train("Oui", True)
Mquestion7.train("Non", False)

# Q8 : Avez-vous des troubles digestifs ?
Mquestion8 = antispam.Detector("question8.dat")
Mquestion8.train("Oui", True)
Mquestion8.train("Non", False)

# Q9 : Avez-vous des nausées et vomissements ?
Mquestion9 = antispam.Detector("question9.dat")
Mquestion9.train("Non", False)

# Q10 : Avez-vous une perte d’appétit ?
Mquestion10 = antispam.Detector("question10.dat")
Mquestion10.train("Oui", True)
Mquestion10.train("Non", False)

# Q11 : Avez-vous séjourné dans une zone à risque ?
Mquestion11 = antispam.Detector("question11.dat")
Mquestion11.train("Non", False)

# Q12 : Avez-vous des problèmes de santé ?
Mquestion12 = antispam.Detector("question12.dat")
Mquestion12.train("Non", False)

# Q13 : Avez-vous des allergies connues ?
Mquestion13 = antispam.Detector("question13.dat")
Mquestion13.train("Non", False)
Mquestion13.train("Oui", True)

# print(Mquestion13.score("Oui"))

#-----------------------------------#
# class patient:
#     def __init__(self, nom, score) :
#         self.nom = nom
#         self.score = score



# tab_question.append( questions('Non', 'Non', 'Non', 'Non', 'Non', 'Non', 'Non', 'Non', 'Non', 'Non', 'Non', 'Non', 'Non'))
# Charlie = Patient('Charlie')
# Charlie.add_question('Non', 'Non', 'Non', 'Non', 'Non', 'Non', 'Non', 'Non', 'Non', 'Non', 'Non', 'Non', 'Non')
# Bob = Patient('Bob')
# Bob.add_question('Oui', 'Oui', 'Oui', 'Oui', 'Oui', 'Oui', 'Oui', 'Oui', 'Oui', 'Oui', 'Oui', 'Oui', 'Oui')

#-----------------------------------#

# GET ALL RETOUR_MEDECIN
class retour_medecin:
    def __init__(self, _id, response, avi, nbrQuestion) :
        self._id = _id
        self.response = response
        self.avi = avi
        self.nbrQuestion = nbrQuestion

response = requests.get("http://localhost:3000/RetourMedecin/")
print(response.json())

if len(response.json()) != 0 :
    for retour_medecin in response.json():
        s = json.dumps(retour_medecin)
        p = json.loads(s)

        retourID = p["_id"]
        #print(retourID)
        
        nbrQ = p["nbrQuestion"]
        #print(nbrQ)

        res = p["response"]
        #print(res)

        isAvi = p["avi"]
        #print(isAvi)
        globals()[f"Mquestion{nbrQ}"].train(res, isAvi)
        globals()[f"Mquestion{nbrQ}"].save()
        deleteResponse = requests.delete('http://localhost:3000/RetourMedecin/' + retourID)


# GET ALL PATIENT
response = requests.get("http://localhost:3000/Patient/")
# print(response.json())

list_responses = []

id = ""

# class Patient: 
#     def __init__(self, patient_id) :
#         self.patient_id = patient_id
#         self.questions = any

#     def add_question(self, tab):
#         self.questions = tab

for patient in response.json():
    tab_score = []
    countMquestion = 1
    s = json.dumps(patient)
    p = json.loads(s)
    
    # tempPatient = Patient(p["_id"])
    # list_responses = p["responses"].split(";")
    # tempPatient.add_question(list_responses)

    list_responses = p["responses"].split(";")
    #print(list_responses)

    for q in list_responses:
        
        if countMquestion == 14 :
            continue
        else:
            tab_score.append(globals()[f"Mquestion{countMquestion}"].score(q))
            countMquestion += 1
    
    Sum = (sum(tab_score)/13)
    #print(tab_score)
    #print(Sum)
    response = requests.put('http://localhost:3000/Patient/' + p["_id"], data = {'score':Sum})
    
#-----------------------------------#

# tab_patient = []
# print("stop")

# import sys 
# sys.exit()

print("stop")
# tab_patient.append(Charlie)
# tab_patient.append(Bob)


# for i in tab_patient:
#     tab_score = []
#     countMquestion = 1
#     print(i.name)
#     print(i.questions)
#     for q in i.questions:
#         if countMquestion == 14 :
#             continue
#         else:
#             tab_score.append(globals()[f"Mquestion{countMquestion}"].score(q))
#             countMquestion += 1
    
#     Sum = (sum(tab_score)/13)
#     print(tab_score)
#     print(Sum)



# for obj in tab_question:
#     tab_score.append(Mquestion1.score(obj.question1))
#     tab_score.append(Mquestion2.score(obj.question2))
#     tab_score.append(Mquestion3.score(obj.question3))
#     tab_score.append(Mquestion4.score(obj.question4))
#     tab_score.append(Mquestion5.score(obj.question5))
#     tab_score.append(Mquestion6.score(obj.question6))
#     tab_score.append(Mquestion7.score(obj.question7))
#     tab_score.append(Mquestion8.score(obj.question8))
#     tab_score.append(Mquestion9.score(obj.question9))
#     tab_score.append(Mquestion10.score(obj.question10))
#     tab_score.append(Mquestion11.score(obj.question11))
#     tab_score.append(Mquestion12.score(obj.question12))
#     tab_score.append(Mquestion13.score(obj.question13))
#     Sum = (sum(tab_score) / 13)
#     for i in tab_patient: 
#         i.append(Sum)
