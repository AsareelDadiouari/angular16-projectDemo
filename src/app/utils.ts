import {AssessmentForm} from "./models/entities/assessmentForm.model";

function getValueOrThrow<T>(value: T | undefined | null): T {
  if (value === undefined || value === null) {
    throw new Error('Value is undefined or null');
  }
  return value;
}

function formIsCompleted(assessment: AssessmentForm) : boolean | undefined {
  return !!(assessment.internshipGeneratedCode &&
    assessment.internshipRatingNote &&
    assessment.studentIntern &&
    assessment.studentIntern.code &&
    assessment.studentIntern.firstname &&
    assessment.studentIntern.lastname &&
    assessment.supervisor &&
    assessment.supervisor.code &&
    assessment.supervisor.email &&
    assessment.supervisor.firstname &&
    assessment.supervisor.lastname &&
    assessment.traineeGlobalEval &&
    assessment.traineeGlobalEval.rating &&
    assessment.traineeKnowledge &&
    assessment.traineeKnowledge.assumeResponsibilities &&
    assessment.traineeKnowledge.fieldOfSpecialization &&
    assessment.traineeKnowledge.makeRecommendations &&
    assessment.traineeKnowledge.popularizeTerminology &&
    assessment.traineeKnowledge.produceRequestedDocs &&
    assessment.traineeKnowledge.writtenCommunicationSkills &&
    assessment.traineeSkillEval &&
    assessment.traineeSkillEval.abilityToWork &&
    assessment.traineeSkillEval.activeListeningSkills &&
    assessment.traineeSkillEval.analyticalSkills &&
    assessment.traineeSkillEval.autonomy &&
    assessment.traineeSkillEval.imagination &&
    assessment.traineeSkillEval.initiative &&
    assessment.traineeSkillEval.oralSkills &&
    assessment.traineeSkillEval.socialAdaptation);
}

function removeUndefinedProperties(obj: any): any {
  for (const prop in obj) {
    if (obj[prop] === undefined) {
      delete obj[prop];
    } else if (typeof obj[prop] === 'object') {
      removeUndefinedProperties(obj[prop]);
    }
  }
  return obj;
}

export default {getValueOrThrow, formIsCompleted, removeUndefinedProperties}
