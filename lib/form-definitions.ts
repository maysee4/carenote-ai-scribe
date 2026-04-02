export type FieldType = 'text' | 'textarea' | 'yesno' | 'select' | 'date' | 'time' | 'number'

export interface FormField {
  id: string
  label: string
  type: FieldType
  options?: string[]
  officeOnly?: boolean
}

export interface FormSection {
  title?: string
  fields: FormField[]
}

export interface FormDefinition {
  id: string
  name: string
  shortName: string
  accessLevel: 'support_worker' | 'nurse'
  description: string
  icon: string
  instructions?: string
  sections: FormSection[]
}

export const FORMS: FormDefinition[] = [
  {
    id: 'feedback',
    name: 'Feedback Form',
    shortName: 'Feedback',
    accessLevel: 'support_worker',
    description: 'Client goal progress and service satisfaction',
    icon: '⭐',
    instructions: 'Used every shift. Describe how the visit went, whether the client was satisfied, any goal progress observed, and any risks or concerns.',
    sections: [
      {
        fields: [
          { id: 'goals_progressing', label: 'Are activities progressing Client Goals?', type: 'yesno' },
          { id: 'goal_progress_comment', label: "Comment on the Customer's Goal Progress", type: 'textarea' },
          { id: 'customer_satisfied', label: 'Was the Customer Satisfied with the service?', type: 'yesno' },
          { id: 'satisfaction_details', label: "Provide Details of the Customer's Satisfaction", type: 'textarea' },
          { id: 'risks_concerns', label: 'Were any risks or concerns identified', type: 'textarea' },
        ],
      },
    ],
  },

  {
    id: 'bristol_bowel',
    name: 'Bristol Bowel Chart',
    shortName: 'Bristol Bowel',
    accessLevel: 'support_worker',
    description: 'Bowel movement documentation and tracking',
    icon: '📋',
    instructions: 'To be completed by all JBC staff when a participant requires bowel management support or when requested by a General Practitioner, Specialist, or Registered Nurse. Describe the bowel event including time, consistency, volume, and any blood or mucous observed.',
    sections: [
      {
        title: 'Bowel Entry',
        fields: [
          { id: 'date', label: 'Date (DD/MM/YYYY)', type: 'date' },
          { id: 'time', label: 'Time', type: 'time' },
          {
            id: 'bristol_type',
            label: 'Bristol Stool Type (1-7)',
            type: 'select',
            options: [
              '1 — Separate hard lumps, like nuts (severe constipation)',
              '2 — Sausage-shaped but lumpy (mild constipation)',
              '3 — Like a sausage but with cracks on its surface (normal)',
              '4 — Like a sausage or snake, smooth and soft (normal)',
              '5 — Soft blobs with clear-cut edges (lacking fibre)',
              '6 — Fluffy pieces with ragged edges, mushy (mild diarrhoea)',
              '7 — Watery, no solid pieces, entirely liquid (severe diarrhoea)',
            ],
          },
          { id: 'bowel_type', label: 'Bowel Type', type: 'text' },
          { id: 'volume', label: 'Volume', type: 'text' },
          { id: 'blood_noted', label: 'Any blood in the stool noted?', type: 'yesno' },
          { id: 'mucous_noted', label: 'Any mucous in the stool noted?', type: 'yesno' },
        ],
      },
    ],
  },

  {
    id: 'food_fluid',
    name: 'Food and Fluid Chart',
    shortName: 'Food & Fluid',
    accessLevel: 'support_worker',
    description: 'Nutrition and hydration intake tracking',
    icon: '🥗',
    instructions: 'Please ensure charts are reviewed regularly by a JBC registered nurse. Please report any change to a client\'s appetite or any concerns about the person\'s condition to your JBC office or registered nurse. Describe what the client ate and drank, meal times, and any fluid measurements.',
    sections: [
      {
        fields: [
          { id: 'weight_kg', label: "Customer's weight (kgs)", type: 'number' },
          { id: 'date_recorded', label: 'Date recorded (DD/MM/YYYY)', type: 'date' },
          {
            id: 'meal_time',
            label: 'Meal time',
            type: 'select',
            options: ['Breakfast', 'Mid Morning', 'Lunch', 'Mid Afternoon', 'Dinner', 'Supper', 'Night Time'],
          },
          { id: 'meal_description', label: 'Meal/Food description', type: 'textarea' },
          { id: 'total_fluid_consumed', label: 'Total fluids consumed in 24hrs (mls)', type: 'text' },
          { id: 'total_fluid_output', label: 'Total fluid output in 24hrs (mls)', type: 'text' },
          { id: 'signature', label: 'Signature', type: 'text' },
        ],
      },
    ],
  },

  {
    id: 'incident',
    name: 'Incident Report',
    shortName: 'Incident',
    accessLevel: 'support_worker',
    description: 'Incident documentation and reporting',
    icon: '⚠️',
    instructions: 'Used to record incidents involving customers directly — events, behaviours, or circumstances that occurred or are alleged to have occurred which impact on self or others, or have the potential to cause harm (e.g. a concern, refusal for service, breach of policy, missed medication, damage to personal belongings). Do NOT use this form to report staff injuries, hazards, or complaints. Describe what happened before, during, and after the incident.',
    sections: [
      {
        fields: [
          { id: 'at_customer_address', label: "Did the incident occur at the customer's address?", type: 'yesno' },
          { id: 'incident_date', label: 'Date of incident (DD/MM/YYYY)', type: 'date' },
          { id: 'incident_time', label: 'Time of incident', type: 'time' },
          { id: 'same_as_reporting', label: 'Person completing form is same as employee reporting', type: 'yesno' },
          { id: 'employee_name', label: 'Name of Employee/person reporting', type: 'text' },
          { id: 'employee_role', label: 'Role of Employee/person reporting', type: 'text' },
          { id: 'reported_via', label: 'Reported via', type: 'text' },
          { id: 'incident_type', label: 'Incident type', type: 'text' },
          {
            id: 'before_incident',
            label: 'What was occurring before the incident? (setting/activity/service/events)',
            type: 'textarea',
          },
          { id: 'describe_incident', label: 'Describe the incident (facts, events, people, actions)', type: 'textarea' },
          {
            id: 'after_incident',
            label: 'What happened after the incident (outcome, actions, who informed)',
            type: 'textarea',
          },
          {
            id: 'incident_ranking',
            label: 'Incident Ranking',
            type: 'select',
            options: ['1 — High', '2 — Medium', '3 — Low'],
          },
        ],
      },
      {
        title: 'OFFICE ONLY',
        fields: [
          { id: 'office_job_title', label: 'Job Title/Role', type: 'text', officeOnly: true },
          { id: 'office_escalated_to', label: 'Escalated to', type: 'text', officeOnly: true },
          { id: 'office_reassessed_ranking', label: 'Reassessed Ranking', type: 'text', officeOnly: true },
          { id: 'office_follow_up', label: 'Follow-up actions/recommendations', type: 'textarea', officeOnly: true },
          { id: 'office_ci_actions', label: 'Continuous improvement actions', type: 'textarea', officeOnly: true },
          { id: 'office_further_training', label: 'Further training required', type: 'textarea', officeOnly: true },
          { id: 'office_customer_consulted', label: 'How was customer consulted', type: 'textarea', officeOnly: true },
        ],
      },
    ],
  },

  {
    id: 'critical_incident',
    name: 'Critical Incident Form',
    shortName: 'Critical Incident',
    accessLevel: 'nurse',
    description: 'Critical incident documentation (Nurse/RN)',
    icon: '🚨',
    instructions: 'For Nurse/RN use only. Describe the critical incident in full — what happened before, during and after, who was involved, who was notified, and any follow-up actions taken. Include names and roles where known.',
    sections: [
      {
        fields: [
          {
            id: 'at_customer_address',
            label: "Did the critical incident occur at customer's address?",
            type: 'yesno',
          },
          { id: 'incident_date', label: 'Date of incident (DD/MM/YYYY)', type: 'date' },
          { id: 'incident_time', label: 'Time of incident', type: 'time' },
          { id: 'same_as_reporting', label: 'Person completing = employee reporting', type: 'yesno' },
          { id: 'employee_name', label: 'Name of Employee/person reporting', type: 'text' },
          { id: 'employee_role', label: 'Role of Employee/person reporting', type: 'text' },
          { id: 'reported_via', label: 'Incident reported via', type: 'text' },
          {
            id: 'other_employees',
            label: 'Other Employees Involved (Name, Role/Position — list all)',
            type: 'textarea',
          },
          {
            id: 'other_persons',
            label: 'Other Persons Involved (customers, carers, community — full name + designation)',
            type: 'textarea',
          },
          { id: 'incident_type', label: 'Incident Type', type: 'text' },
          {
            id: 'initial_ranking',
            label: 'Initial Incident Ranking',
            type: 'select',
            options: ['1 — High'],
          },
          { id: 'before_incident', label: 'What was occurring before the incident?', type: 'textarea' },
          {
            id: 'describe_incident',
            label: 'Describe the incident/allegation (facts, events, people, actions, whether witnessed)',
            type: 'textarea',
          },
          { id: 'after_incident', label: 'What happened following the incident/allegation', type: 'textarea' },
          {
            id: 'who_informed',
            label: 'Who was informed of the critical incident (immediately or soon after)',
            type: 'textarea',
          },
          { id: 'follow_up_actions', label: 'Follow up actions and recommendations', type: 'textarea' },
          {
            id: 'customer_consultation',
            label: 'Customer Consultation: How was the customer consulted and engaged in resolving the issues',
            type: 'textarea',
          },
          { id: 'learnings', label: 'Learnings from the Critical Incident', type: 'textarea' },
          {
            id: 'learning_category',
            label: 'Learning category',
            type: 'select',
            options: [
              'Current Customer service/outcomes',
              'Service Delivery',
              'Policy/Procedure',
              'Clinical Care',
              'Planning and Support',
              'Communication',
              'Engagement and consultation',
              'Other',
            ],
          },
        ],
      },
    ],
  },

  {
    id: 'sah_clinical',
    name: 'SAH Clinical Comprehensive Assessment',
    shortName: 'SAH Clinical Assessment',
    accessLevel: 'nurse',
    description: 'Comprehensive clinical assessment (RN only)',
    icon: '🏥',
    instructions: 'Registered Nurse use only. Conducted with the participant present — takes approximately 1 hour. Screening questions guide the assessment. If a response indicates potential risk, apply clinical judgement. Describe the participant\'s full health status, history, functional capacity, medications, cognition, and any other relevant clinical findings.',
    sections: [
      {
        title: 'Section 1 — Intake/Consent',
        fields: [
          { id: 's1_tis_needed', label: 'Does the participant need TIS?', type: 'yesno' },
          { id: 's1_hearing_vision', label: 'Hearing/vision/speech difficulties?', type: 'yesno' },
          { id: 's1_capacity', label: 'Capacity to make own decisions?', type: 'yesno' },
          { id: 's1_substitute_dm', label: 'Substitute decision maker?', type: 'yesno' },
          { id: 's1_sdm_present', label: 'SDM present for assessment?', type: 'yesno' },
          { id: 's1_cultural_requirements', label: 'Cultural/spiritual/religious requirements', type: 'textarea' },
          { id: 's1_atsi', label: 'Aboriginal and/or Torres Strait Islander?', type: 'yesno' },
        ],
      },
      {
        title: 'Section 2 — Presenting Needs',
        fields: [
          { id: 's2_current_needs', label: 'Document current needs and concerns', type: 'textarea' },
          { id: 's2_funding_class', label: 'Support at Home funding classification approved for', type: 'text' },
          {
            id: 's2_short_term',
            label: 'Approved for short term pathways? (restorative care/AT-HM/end-of-life)',
            type: 'yesno',
          },
          { id: 's2_change_triggered', label: 'Assessment triggered due to change or deterioration?', type: 'yesno' },
          { id: 's2_primary_needs', label: 'Primary needs and concerns', type: 'textarea' },
        ],
      },
      {
        title: 'Section 3 — General Health and Medical History',
        fields: [
          {
            id: 's3_medical_overview',
            label: 'Overview of Medical Background and Current Health Status',
            type: 'textarea',
          },
          { id: 's3_gp_summary', label: 'Happy for JBC to request health summary from GP?', type: 'yesno' },
          { id: 's3_conditions', label: 'Current medical conditions/diagnoses', type: 'textarea' },
          { id: 's3_surgery', label: 'Surgery in the past?', type: 'yesno' },
          { id: 's3_surgery_details', label: 'Surgery details', type: 'textarea' },
          { id: 's3_allergies', label: 'Allergies? (Environmental/food/other)', type: 'textarea' },
          { id: 's3_hospital', label: 'Recent hospital admissions or emergency visits?', type: 'yesno' },
          { id: 's3_hospital_details', label: 'Hospital admission details', type: 'textarea' },
          { id: 's3_current_gp', label: 'Current GP?', type: 'yesno' },
          { id: 's3_gp_frequency', label: 'How often do you see them?', type: 'text' },
          {
            id: 's3_vaccinations',
            label: 'Up-to-date with seasonal vaccinations? (COVID-19, Influenza)',
            type: 'yesno',
          },
          { id: 's3_medical_devices', label: 'Medical devices? (PPM, CPAP, insulin pump)', type: 'yesno' },
          { id: 's3_medical_devices_details', label: 'Medical devices details', type: 'textarea' },
          { id: 's3_health_changes', label: 'Recent changes in health?', type: 'yesno' },
          { id: 's3_health_changes_details', label: 'Health changes details', type: 'textarea' },
        ],
      },
      {
        title: 'Section 4 — Frailty and Functional Capacity',
        fields: [
          {
            id: 's4_adl_independent',
            label: 'Independent with activities of daily living? (bathing, dressing, cooking, shopping)',
            type: 'yesno',
          },
          { id: 's4_hygiene_independent', label: 'Independent with personal hygiene?', type: 'yesno' },
          { id: 's4_mobility_support', label: 'Need support with mobility, transfers, or stairs?', type: 'yesno' },
          { id: 's4_energy_decline', label: 'Decline in energy, strength, or stamina?', type: 'yesno' },
        ],
      },
      {
        title: 'Section 5 — ADL Assessment',
        fields: [
          { id: 's5_move_in_bed', label: 'Ability to move in bed (scored)', type: 'text' },
          { id: 's5_toileting', label: 'Toileting (scored)', type: 'text' },
          { id: 's5_transferring', label: 'Transferring (scored)', type: 'text' },
          { id: 's5_eating', label: 'Eating (scored)', type: 'text' },
          { id: 's5_total_score', label: 'Total Score (4-18)', type: 'text' },
          { id: 's5_interventions', label: 'Management or intervention strategies', type: 'textarea' },
        ],
      },
      {
        title: 'Section 6 — Medication Management',
        fields: [
          { id: 's6_medications', label: 'Current medications', type: 'textarea' },
          { id: 's6_dispensed_how', label: 'How medications dispensed', type: 'text' },
          { id: 's6_who_manages', label: 'Who manages medications? (self/family/provider/other)', type: 'text' },
          { id: 's6_med_allergies', label: 'Allergies or past reactions to medications or vaccines?', type: 'yesno' },
          { id: 's6_med_allergies_details', label: 'Medication allergy details', type: 'textarea' },
          { id: 's6_side_effects', label: 'Side effects from regular medications?', type: 'yesno' },
          { id: 's6_side_effects_details', label: 'Side effects details', type: 'textarea' },
          { id: 's6_recent_med_changes', label: 'Recent change to medications/side effects?', type: 'yesno' },
          { id: 's6_swallowing_difficulties', label: 'Difficulties swallowing tablets?', type: 'yesno' },
          { id: 's6_pharmacist_review', label: 'Pharmacist medication review undertaken?', type: 'yesno' },
          { id: 's6_remembering_difficulty', label: 'Difficulty remembering medications?', type: 'yesno' },
          { id: 's6_home_med_review', label: 'Aware of Home Medication Review Scheme?', type: 'yesno' },
          { id: 's6_med_use_adherence', label: 'Medication Use and Adherence notes', type: 'textarea' },
          {
            id: 's6_safety_review',
            label: 'Safety Review (high risk meds, side effects, storage, escalation required)',
            type: 'textarea',
          },
          { id: 's6_rn_action_plan', label: 'RN Action Plan', type: 'textarea' },
          { id: 's6_next_review_date', label: 'Next review date', type: 'date' },
        ],
      },
      {
        title: 'Section 7 — Cognitive Function',
        fields: [
          {
            id: 's7_dementia_diagnosis',
            label: 'Ever diagnosed with dementia, delirium, or cognitive condition?',
            type: 'yesno',
          },
          { id: 's7_memory_difficulties', label: 'Memory difficulties, confusion, disorientation?', type: 'yesno' },
          {
            id: 's7_thinking_changes',
            label: 'Changes in thinking, decision-making, problem-solving?',
            type: 'yesno',
          },
          { id: 's7_anxiety_situations', label: 'Situations causing anxiety or behaviour changes?', type: 'yesno' },
          { id: 's7_4at_assessment', label: '4AT Delirium Assessment result', type: 'textarea' },
        ],
      },
      {
        title: 'Section 8 — Choking and Swallowing',
        fields: [
          {
            id: 's8_swallowing_difficulties',
            label: 'Difficulties chewing or swallowing food/fluids?',
            type: 'yesno',
          },
          { id: 's8_choking_history', label: 'Ever choked or coughed when eating/drinking?', type: 'yesno' },
          {
            id: 's8_modified_food',
            label: 'Eating/drinking modified food or fluids? (e.g. thickened)',
            type: 'yesno',
          },
          { id: 's8_mealtime_plan', label: 'Mealtime management plan?', type: 'yesno' },
          { id: 's8_speech_pathology', label: 'Last speech pathology review', type: 'text' },
        ],
      },
      {
        title: 'Section 9 — Continence',
        fields: [
          {
            id: 's9_bladder_bowel',
            label: 'Bladder or bowel difficulties? (urgency/frequency/accidents/constipation/retention)',
            type: 'yesno',
          },
          { id: 's9_continence_details', label: 'Continence details', type: 'textarea' },
          { id: 's9_products', label: 'Products for continence care?', type: 'yesno' },
          { id: 's9_stoma', label: 'Stoma?', type: 'yesno' },
          {
            id: 's9_catheter',
            label: 'Indwelling catheter/SPC/intermittent catheterisation?',
            type: 'yesno',
          },
        ],
      },
      {
        title: 'Section 10 — Falls and Mobility',
        fields: [
          { id: 's10_falls_12m', label: 'Falls in the past 12 months?', type: 'yesno' },
          { id: 's10_unsteady', label: 'Unsteady on feet or needs support when walking?', type: 'yesno' },
          { id: 's10_balance', label: 'Balance and strength description', type: 'textarea' },
          { id: 's10_mobility_aids', label: 'Mobility aids used?', type: 'yesno' },
          { id: 's10_mobility_aids_details', label: 'Mobility aids details', type: 'text' },
          { id: 's10_physio_ot', label: 'Recent physio/OT review?', type: 'yesno' },
          { id: 's10_frop_falls_score', label: 'FROP-Com: Falls History score', type: 'text' },
          { id: 's10_frop_adl_score', label: 'FROP-Com: Function ADL score', type: 'text' },
          { id: 's10_frop_balance_score', label: 'FROP-Com: Balance score', type: 'text' },
          { id: 's10_frop_total', label: 'FROP-Com: Total Risk Score (0-9)', type: 'text' },
          { id: 's10_brochure', label: 'JBC Falls Prevention brochure provided?', type: 'yesno' },
          { id: 's10_prevention_programs', label: 'Eligible for local falls prevention programs?', type: 'yesno' },
          { id: 's10_strategies', label: 'Falls prevention strategies applied', type: 'textarea' },
          { id: 's10_interventions', label: 'Interventions required', type: 'textarea' },
          { id: 's10_referrals', label: 'Referrals applicable', type: 'textarea' },
        ],
      },
      {
        title: 'Section 11 — FRAIL Scale',
        fields: [
          { id: 's11_fatigue', label: 'Fatigue: how often tired in past 4 weeks', type: 'text' },
          {
            id: 's11_resistance',
            label: 'Resistance: difficulty walking up 10 steps without resting?',
            type: 'yesno',
          },
          { id: 's11_ambulation', label: 'Ambulation: difficulty walking a couple of blocks?', type: 'yesno' },
          { id: 's11_illnesses', label: 'Illnesses: diagnosed conditions', type: 'textarea' },
          { id: 's11_illness_score', label: 'Illness score', type: 'text' },
          { id: 's11_current_weight', label: 'Current weight (kg)', type: 'number' },
          { id: 's11_weight_year_ago', label: 'Weight one year ago (kg)', type: 'number' },
          { id: 's11_weight_change_pct', label: 'Percentage weight change', type: 'text' },
          { id: 's11_weight_5pct', label: 'Weight change > 5%?', type: 'yesno' },
          { id: 's11_total_score', label: 'Total FRAIL Scale score', type: 'text' },
        ],
      },
      {
        title: 'Section 12 — Frailty Interventions',
        fields: [{ id: 's12_interventions', label: 'Frailty interventions', type: 'textarea' }],
      },
      {
        title: 'Section 13 — Nutrition and Hydration',
        fields: [
          { id: 's13_weight', label: 'Current weight (kg)', type: 'number' },
          { id: 's13_weight_change', label: 'Weight loss or gain in last 12 months?', type: 'yesno' },
          { id: 's13_special_diet', label: 'Special diet?', type: 'yesno' },
          { id: 's13_special_diet_details', label: 'Special diet details', type: 'textarea' },
          { id: 's13_appetite', label: 'Difficulties with appetite?', type: 'yesno' },
          { id: 's13_fluid_intake', label: 'Fluid intake per day', type: 'text' },
          { id: 's13_fluid_restriction', label: 'Fluid restriction?', type: 'yesno' },
          {
            id: 's13_further_info',
            label: 'Further information: special diets, poor appetite, fluid restrictions',
            type: 'textarea',
          },
        ],
      },
      {
        title: 'Section 14 — Mental Health',
        fields: [
          { id: 's14_mood', label: 'Overall mood and wellbeing description', type: 'textarea' },
          { id: 's14_anxiety_depression', label: 'Ever experienced anxiety, depression, hopelessness?', type: 'yesno' },
          { id: 's14_mh_medication', label: 'Ever taken medication to support mental health?', type: 'yesno' },
          { id: 's14_self_harm', label: 'Thoughts of self-harm?', type: 'yesno' },
          { id: 's14_mh_plan', label: 'Mental health plan or support plan?', type: 'yesno' },
          { id: 's14_gp_support', label: 'Supported by GP/psychologist/family?', type: 'yesno' },
          { id: 's14_strategies', label: 'Strategies or supports that help', type: 'textarea' },
          { id: 's14_further_details', label: 'Further details', type: 'textarea' },
          { id: 's14_gds_score', label: 'Geriatric Depression Scale (GDS) score', type: 'text' },
        ],
      },
      {
        title: 'Section 15 — Oral Health',
        fields: [
          { id: 's15_dental_checkups', label: 'Regular dental check-ups with dentist?', type: 'yesno' },
          { id: 's15_last_checkup', label: 'Last dental check-up', type: 'text' },
          {
            id: 's15_dental_pain',
            label: 'Pain, bleeding, difficulty with teeth/gums/dentures?',
            type: 'yesno',
          },
          { id: 's15_prosthetics', label: 'Dental prosthetics?', type: 'yesno' },
          { id: 's15_mouth_care_support', label: 'Need support with daily mouth care?', type: 'yesno' },
        ],
      },
      {
        title: 'Section 16 — Pain',
        fields: [
          { id: 's16_pain', label: 'Experience pain?', type: 'yesno' },
          { id: 's16_pain_description', label: 'Pain description', type: 'textarea' },
        ],
      },
      {
        title: 'Section 17 — Pressure Injury and Skin Integrity',
        fields: [
          {
            id: 's17_skin_conditions',
            label: 'Skin conditions? (cellulitis, dryness, pruritus)',
            type: 'yesno',
          },
          { id: 's17_skin_details', label: 'Skin condition details', type: 'textarea' },
          { id: 's17_wounds', label: 'Wounds or ulcers?', type: 'yesno' },
          { id: 's17_pressure_injury_history', label: 'History of pressure injuries?', type: 'yesno' },
          { id: 's17_wounds_history', label: 'History of wounds?', type: 'yesno' },
          {
            id: 's17_prolonged_sitting',
            label: 'Spends long periods sitting/lying without changing position?',
            type: 'yesno',
          },
          {
            id: 's17_pressure_aids',
            label: 'Pressure relieving aids? (mattress, wedges, cushions)',
            type: 'yesno',
          },
          { id: 's17_pressure_aids_details', label: 'Pressure relieving aids details', type: 'text' },
        ],
      },
      {
        title: 'Section 18 — Sensory Impairment',
        fields: [
          {
            id: 's18_sensory_difficulties',
            label: 'Difficulties with hearing, vision, or balance?',
            type: 'yesno',
          },
          { id: 's18_aids', label: 'Uses aids: glasses/hearing aids/other?', type: 'yesno' },
          { id: 's18_aids_details', label: 'Aids details', type: 'text' },
          { id: 's18_aids_effective', label: 'Aids working effectively?', type: 'yesno' },
          { id: 's18_eye_tests', label: 'Regular eye tests/optometrist check-ups?', type: 'yesno' },
          { id: 's18_further_details', label: 'Further details', type: 'textarea' },
        ],
      },
      {
        title: 'Section 19 — Wellness and Reablement',
        fields: [
          {
            id: 's19_goals',
            label: 'Personal goals for health, independence, daily living',
            type: 'textarea',
          },
          {
            id: 's19_activities',
            label: 'Activities to improve or get back to doing (cooking, walking, gardening)',
            type: 'textarea',
          },
          { id: 's19_strengths', label: 'Strengths/abilities to build on', type: 'textarea' },
          {
            id: 's19_supports',
            label: 'Short-term supports or therapies that could help (physio, OT, nursing)',
            type: 'textarea',
          },
          {
            id: 's19_self_support',
            label: 'Things participant could do themselves with a little support',
            type: 'textarea',
          },
          { id: 's19_restorative', label: 'Interested in restorative care plan?', type: 'yesno' },
          {
            id: 's19_involve',
            label: 'Who to involve in goal setting (Family/GP/Allied health/Other)',
            type: 'textarea',
          },
        ],
      },
      {
        title: 'Section 20 — Advance Care Planning',
        fields: [
          {
            id: 's20_discussions',
            label: 'Had discussions about wishes if health deteriorates?',
            type: 'yesno',
          },
          {
            id: 's20_no_reason',
            label: 'If No: document reason and plan to discuss in future',
            type: 'textarea',
          },
          { id: 's20_acd', label: 'Has ACD/AHD/SOC?', type: 'yesno' },
          { id: 's20_epoa', label: 'Elected substitute decision maker or Enduring POA/guardian?', type: 'yesno' },
          {
            id: 's20_beliefs',
            label: 'Beliefs, values, preferences for future care decisions',
            type: 'textarea',
          },
          { id: 's20_booklet', label: 'Copy of advance care directive booklet provided?', type: 'yesno' },
        ],
      },
      {
        title: 'Section 21 — Signature',
        fields: [{ id: 's21_who_signing', label: 'Who is signing', type: 'text' }],
      },
    ],
  },

  {
    id: 'safety_assessment',
    name: 'In-Home Safety Assessment',
    shortName: 'Safety Assessment',
    accessLevel: 'nurse',
    description: 'Home environment safety evaluation',
    icon: '🏠',
    instructions: 'Nurse/RN use only. Walk through the home with the participant and describe what you observed — emergency exits, fire safety equipment, security, lighting, and any internal room-by-room risks identified. Note whether manual handling is involved and any risk management actions required.',
    sections: [
      {
        fields: [
          {
            id: 'emergency_self_evacuate',
            label: 'Participant knows what constitutes emergency requiring self-evacuation?',
            type: 'yesno',
          },
          { id: 'knows_exit', label: 'Knows quickest exit?', type: 'yesno' },
          { id: 'assembly_area', label: 'Identified assembly area in case of fire/emergency?', type: 'yesno' },
          { id: 'fire_equipment', label: 'Fire extinguishers/fire blankets present?', type: 'yesno' },
          { id: 'smoke_detectors', label: 'Fire alarms/smoke detectors present and working?', type: 'yesno' },
          { id: 'neighbour_contact', label: 'Participant has contact with neighbours?', type: 'yesno' },
          { id: 'security_cameras', label: 'Security cameras installed?', type: 'yesno' },
          { id: 'motion_lighting', label: 'Motion sensor activated lighting?', type: 'yesno' },
          { id: 'locks_operable', label: 'Locks easy to operate?', type: 'yesno' },
          { id: 'personal_alarm', label: 'Personal safety alarm system in place?', type: 'yesno' },
          { id: 'additional_comments', label: 'Additional comments', type: 'textarea' },
        ],
      },
      {
        title: 'Risk Considerations — General',
        fields: [
          { id: 'risk_pets', label: 'Pets', type: 'text' },
          { id: 'risk_outside', label: 'Outside Residence', type: 'text' },
          { id: 'risk_infection', label: 'Infection Control', type: 'text' },
        ],
      },
      {
        title: 'Risk Considerations — Internal',
        fields: [
          { id: 'risk_flooring', label: 'Flooring', type: 'text' },
          { id: 'risk_fire', label: 'Fire prevention', type: 'text' },
          { id: 'risk_bathroom', label: 'Bathroom/Toilet', type: 'text' },
          { id: 'risk_kitchen', label: 'Kitchen', type: 'text' },
          { id: 'risk_laundry', label: 'Laundry', type: 'text' },
          { id: 'risk_bedrooms', label: 'Bedrooms', type: 'text' },
          { id: 'risk_lounge', label: 'Lounge/Living', type: 'text' },
          { id: 'risk_hallways', label: 'Doorways/Hallways', type: 'text' },
          { id: 'risk_lighting', label: 'General lighting/visibility', type: 'text' },
          { id: 'risk_noise', label: 'Environmental noise', type: 'text' },
          { id: 'risk_chemicals', label: 'Hazardous substances/chemicals', type: 'text' },
          { id: 'risk_weapons', label: 'Weapons present', type: 'text' },
          { id: 'risk_climate', label: 'Climate control', type: 'text' },
          { id: 'risk_leads', label: 'Leads/cords', type: 'text' },
          { id: 'risk_cleaning_storage', label: 'Access/Storage of cleaning products', type: 'text' },
          { id: 'risk_cleaning_equipment', label: 'Suitability of cleaning equipment', type: 'text' },
          { id: 'risk_other', label: 'Other', type: 'text' },
        ],
      },
      {
        title: 'Manual Handling and Equipment',
        fields: [
          { id: 'manual_handling', label: 'Is manual handling involved?', type: 'yesno' },
          { id: 'manual_handling_details', label: 'Manual handling details', type: 'textarea' },
        ],
      },
      {
        title: 'Risk Management',
        fields: [
          {
            id: 'risk_management_plan',
            label: 'Are any items being addressed through a Risk Management plan?',
            type: 'yesno',
          },
          { id: 'signature', label: 'Signature', type: 'text' },
        ],
      },
    ],
  },

  {
    id: 'falls_screening',
    name: 'Home Falls and Accidents Screening Tool (FOCL006)',
    shortName: 'Falls Screening',
    accessLevel: 'nurse',
    description: 'Home falls risk assessment — score out of 25',
    icon: '🚶',
    instructions: 'Home FAST — completed at commencement and annually or sooner if clinically indicated. Score 1 point for each "No" response (total out of 25). Describe what you observed in the home for each area: floors, lighting, bathroom, kitchen, stairs, and mobility. Include any handrail or grab rail details.',
    sections: [
      {
        fields: [
          { id: 'q1', label: 'Are walkways free of cords and clutter?', type: 'yesno' },
          { id: 'q2', label: 'Are floor coverings in good condition?', type: 'yesno' },
          { id: 'q3', label: 'Are floor surfaces non-slip?', type: 'yesno' },
          { id: 'q4', label: 'Are loose mats securely fixed to the floor?', type: 'yesno' },
          { id: 'q5', label: 'Can the person get in and out of bed easily and safely?', type: 'yesno' },
          { id: 'q6', label: 'Can the person get up from their lounge chair easily?', type: 'yesno' },
          { id: 'q7', label: 'Are all lights bright enough to see clearly?', type: 'yesno' },
          { id: 'q8', label: 'Can the person switch a light on easily from their bed?', type: 'yesno' },
          { id: 'q9', label: 'Are outside paths, steps and entrances well lit at night?', type: 'yesno' },
          { id: 'q10', label: 'Can person get on and off toilet easily and safely?', type: 'yesno' },
          { id: 'q11', label: 'Can person get in and out of bath easily and safely?', type: 'yesno' },
          { id: 'q12', label: 'Can person walk in and out of shower easily and safely?', type: 'yesno' },
          {
            id: 'q13',
            label: 'Is there a sturdy grab rail in shower or beside bath?',
            type: 'yesno',
          },
          { id: 'q13_details', label: 'Grab rail details', type: 'text' },
          {
            id: 'q14',
            label: 'Are slip resistant mats/strips used in bath/bathroom/shower recess?',
            type: 'yesno',
          },
          { id: 'q14_details', label: 'Slip resistant details', type: 'text' },
          {
            id: 'q15',
            label: 'Do outdoor steps have accessible/sturdy handrail along full length?',
            type: 'yesno',
          },
          { id: 'q15_details', label: 'Outdoor handrail details', type: 'text' },
          { id: 'q16', label: 'Is toilet in close proximity to bedroom?', type: 'yesno' },
          {
            id: 'q17',
            label: 'Can person reach kitchen items without climbing, bending or upsetting balance?',
            type: 'yesno',
          },
          { id: 'q18', label: 'Can person carry meals safely from kitchen to dining area?', type: 'yesno' },
          {
            id: 'q19',
            label: 'Do indoor steps have accessible/sturdy handrail along full length?',
            type: 'yesno',
          },
          { id: 'q20', label: 'Are paths around house in good repair and free of clutter?', type: 'yesno' },
          { id: 'q21', label: 'Can person easily go up and down steps inside or outside?', type: 'yesno' },
          { id: 'q22', label: 'Are edges of steps (inside and outside) easily identified?', type: 'yesno' },
          { id: 'q23', label: 'Can person use entrance door safely and easily?', type: 'yesno' },
          { id: 'q24', label: 'Is person currently wearing well-fitting shoes or slippers?', type: 'yesno' },
          {
            id: 'q25',
            label: 'If there are pets — can person care for them without risk of falling?',
            type: 'yesno',
          },
          { id: 'overall_score', label: 'Overall Score (out of 25)', type: 'text' },
          { id: 'risks_identified', label: 'Risks identified?', type: 'yesno' },
          { id: 'assessor_name', label: 'Name', type: 'text' },
          { id: 'signature', label: 'Signature', type: 'text' },
          { id: 'assessment_date', label: 'Date', type: 'date' },
        ],
      },
    ],
  },

  {
    id: 'care_plan',
    name: 'Care Plan / Planning Meeting Record',
    shortName: 'Care Plan',
    accessLevel: 'nurse',
    description: 'Care planning and review documentation',
    icon: '📝',
    instructions: 'Used to record key details of care and services planning for Support at Home participants, including annual reviews. Describe the meeting — who attended, what was discussed, any areas of difficulty identified, clinical care considerations, medication management, and advance care planning status.',
    sections: [
      {
        fields: [
          {
            id: 'record_type',
            label: 'Is this a new planning record or annual review?',
            type: 'select',
            options: ['New Planning Record', 'Annual Review'],
          },
          { id: 'mode', label: 'Time/Place/Mode (Face-to-face/phone/etc.)', type: 'text' },
          { id: 'meeting_date', label: 'Date', type: 'date' },
          { id: 'meeting_time', label: 'Time', type: 'time' },
          { id: 'location', label: 'Location', type: 'text' },
          {
            id: 'other_contributors',
            label: 'Were there other contributors to the planning meeting?',
            type: 'yesno',
          },
          { id: 'people_involved', label: 'People involved (Name, Role — list all)', type: 'textarea' },
          { id: 'is_review', label: 'Is this a Review of care and services?', type: 'yesno' },
          {
            id: 'changes_since_review',
            label: 'If Review: changes in areas of difficulty from last review?',
            type: 'yesno',
          },
          { id: 'changes_details', label: 'Changes details', type: 'textarea' },
          { id: 'areas_of_difficulty', label: 'Areas of difficulty', type: 'textarea' },
          {
            id: 'participant_difficulty',
            label: 'Are there any areas of difficulty as identified by participant?',
            type: 'yesno',
          },
          { id: 'participant_difficulty_details', label: 'Participant difficulty details', type: 'textarea' },
        ],
      },
      {
        title: 'Service Considerations',
        fields: [
          {
            id: 'clinical_items_not_approved',
            label: 'Clinical care items identified but NOT approved (list all applicable)',
            type: 'textarea',
          },
          { id: 'action_required', label: 'For each flagged item: action required', type: 'textarea' },
        ],
      },
      {
        title: 'Medication',
        fields: [
          {
            id: 'takes_medication',
            label: 'Does participant take medication to manage health conditions?',
            type: 'yesno',
          },
          { id: 'self_manage', label: 'Will Participant self-manage?', type: 'yesno' },
          {
            id: 'supported_by_carer',
            label: 'Will Participant be supported by a nominated carer?',
            type: 'yesno',
          },
          { id: 'prompting_required', label: 'Will Participant require prompting to administer?', type: 'yesno' },
        ],
      },
      {
        title: 'Advance Care Planning',
        fields: [
          { id: 'acd_in_place', label: 'ACD/AHD/SOC in place?', type: 'yesno' },
          {
            id: 'acd_info_requested',
            label: 'If No: does participant wish to be provided with information?',
            type: 'yesno',
          },
        ],
      },
    ],
  },
]
