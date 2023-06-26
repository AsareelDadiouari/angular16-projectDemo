import {Intern} from "./Intern";
import {Supervisor} from "./Supervisor.model";

export type AssessmentForm = {
  studentIntern : Intern
  internshipRatingNote: string
  traineeSkillEval: TraineeSkillEval
  traineeKnowledge : TraineeKnowledge
  traineeGlobalEval : TraineeGlobalEval
  supervisor : Supervisor
};

interface TraineeSkillEval {
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

interface TraineeKnowledge {
  writtenCommunicationSkills : string,
  fieldOfSpecialization : string
  assumeResponsibilities : string
  produceRequestedDocs : string
  makeRecommendations : string
  popularizeTerminology : string
  additionalInfo : string
}

interface TraineeGlobalEval {
  rating : string,
  additionalInfo : string
}
