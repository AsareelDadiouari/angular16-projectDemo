import {Intern} from "./intern";
import {Supervisor} from "./supervisor.model";

export type AssessmentForm = {
  id?: string
  internshipGeneratedCode? : string
  studentIntern : Intern
  internshipRatingNote?: string
  traineeSkillEval?: TraineeSkillEval
  traineeKnowledge?: TraineeKnowledge
  traineeGlobalEval?: TraineeGlobalEval
  supervisor : Supervisor
};

export interface TraineeSkillEval {
  autonomy : string
  activeListeningSkills : string
  abilityToWork : string
  socialAdaptation : string
  initiative : string
  imagination : string
  analyticalSkills : string
  oralSkills : string
  additionalInfo : string
}

export interface TraineeKnowledge {
  writtenCommunicationSkills : string,
  fieldOfSpecialization : string
  assumeResponsibilities : string
  produceRequestedDocs : string
  makeRecommendations : string
  popularizeTerminology : string
  additionalInfo : string
}

export interface TraineeGlobalEval {
  rating : string,
  additionalInfo : string
}
