// server/src/data/exercises.ts
type MCQOptions = {
  [key: string]: string;
};

type TextInputOptions = {
  accepted: string[];
  common_mistakes: {
    [key: string]: string;
  };
};

type MCQFeedback = {
  [key: string]: string;
};

type TextInputFeedback = {
  default: string;
  hint: string;
};

export interface BaseExercise {
  id: string;
  category: string;
  subcategory: string;
  difficultyLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  instruction: string;
  sentence: string;
  points: number;
  timeLimit: number;
  tags: string[];
}

export interface MCQExercise extends BaseExercise {
  type: 'mcq';
  options: MCQOptions;
  correctAnswer: string;
  feedback: MCQFeedback;
}

export interface TextInputExercise extends BaseExercise {
  type: 'text_input';
  options: TextInputOptions;
  correctAnswer: string;
  feedback: TextInputFeedback;
}

export type Exercise = MCQExercise | TextInputExercise;
  
export const exercises: Exercise[] = [
        {
          "id": "test_gr_nom_genre_qcm_a1_001",
          "category": "nom",
          "subcategory": "genre",
          "type": "mcq",
          "difficultyLevel": "A1",
          "instruction": "Choisissez l'article correct",
          "sentence": "En France, ___ commence à quinze ans.",
          "options": {
            "a": "la lycée",
            "b": "le lycée",
            "c": "un lycée",
            "d": "les lycées"
          },
          "correctAnswer": "b",
          "feedback": {
            "a": "« Lycée » est un nom masculin, donc l'article féminin « la » est incorrect. Il faut utiliser l'article masculin « le ».",
            "b": "« Lycée » est masculin singulier, et « le » est l'article défini masculin singulier approprié.",
            "c": "« Un lycée » est grammaticalement correct, mais ici, on parle du lycée en général. L'article défini « le » est donc plus approprié.",
            "d": "« Les lycées » est au pluriel, alors que le verbe « commence » est au singulier. Il y a une incohérence en nombre."
          },
          "points": 10,
          "timeLimit": 30,
          "tags": ["article", "genre", "masculin", "singulier"]
        },
        {
          "id": "test_gr_nom_genre_qcm_a1_002",
          "category": "nom",
          "subcategory": "genre",
          "type": "mcq",
          "difficultyLevel": "A1",
          "instruction": "Choisissez l'article correct",
          "sentence": "C'est ___ de magie qu'il a réalisé.",
          "options": {
            "a": "une beau tour",
            "b": "un belle tour",
            "c": "un beau tour",
            "d": "une belle tour"
          },
          "correctAnswer": "c",
          "feedback": {
            "a": "« Tour » est masculin, donc l'article « une » (féminin) est incorrect. Il faut utiliser « un ».",
            "b": "L'article « un » est correct, mais l'adjectif « belle » est féminin alors que « tour » est masculin. Il faut « beau ».",
            "c": "« Un beau tour » accorde correctement l'article et l'adjectif masculins avec le nom masculin « tour ».",
            "d": "Les deux, l'article « une » et l'adjectif « belle », sont féminins, mais « tour » est masculin dans ce contexte."
          },
          "points": 10,
          "timeLimit": 30,
          "tags": ["article", "genre", "adjectif", "masculin"]
        },
        {
          "id": "test_gr_nom_genre_qcm_a1_003",
          "category": "nom",
          "subcategory": "genre",
          "type": "mcq",
          "difficultyLevel": "A1",
          "instruction": "Choisissez l'article correct",
          "sentence": "Dans ce musée, on peut voir ___ magnifique.",
          "options": {
            "a": "un œuvre",
            "b": "des œuvres",
            "c": "une œuvre",
            "d": "l'œuvre"
          },
          "correctAnswer": "c",
          "feedback": {
            "a": "« Œuvre » est un nom féminin, donc l'article masculin « un » est incorrect. Il faut utiliser l'article féminin « une ».",
            "b": "« Des œuvres » est au pluriel, mais le contexte indique qu'il s'agit d'une seule œuvre. Il faut donc rester au singulier avec « une œuvre ».",
            "c": "« Une œuvre » est la forme correcte car « œuvre » est un nom féminin et singulier, nécessitant l'article féminin « une ».",
            "d": "« L'œuvre » est correct si on parle d'une œuvre particulière, mais ici, on parle d'une œuvre parmi d'autres."
          },
          "points": 10,
          "timeLimit": 30,
          "tags": ["article", "genre", "féminin", "singulier"]
        },
        {
          "id": "test_gr_nom_genre_qcm_a1_004",
          "category": "nom",
          "subcategory": "genre",
          "type": "mcq",
          "difficultyLevel": "A1",
          "instruction": "Choisissez l'article correct",
          "sentence": "___ parlent beaucoup de cette histoire étrange.",
          "options": {
            "a": "Le journal français",
            "b": "Les journaux françaises",
            "c": "Les journaux français",
            "d": "Les journaux de français"
          },
          "correctAnswer": "c",
          "feedback": {
            "a": "« Le journal français » est au singulier, mais le contexte demande une forme plurielle.",
            "b": "« Françaises » est au féminin pluriel, mais « journaux » est masculin pluriel. Il faut donc utiliser l'adjectif masculin pluriel : « français ».",
            "c": "Correct. « Journaux » est le pluriel de « journal », et « français » est l'adjectif masculin pluriel approprié.",
            "d": "« Les journaux de français » n'est pas la forme correcte ici, car il s'agit d'une description (« journaux français ») et non d'une relation."
          },
          "points": 10,
          "timeLimit": 30,
          "tags": ["article", "genre", "adjectif", "pluriel"]
        },
        {
          "id": "test_gr_verbe_present_text_a1_001",
          "category": "verbe",
          "subcategory": "present",
          "type": "text_input",
          "difficultyLevel": "A1",
          "instruction": "Conjuguez le verbe entre crochets au présent de l'indicatif",
          "sentence": "Chaque matin, [je boire] un café avant d'aller travailler.",
          "options": {
            "accepted": ["je bois"],
            "common_mistakes": {
              "je boit": "C'est la forme pour il/elle/on. Avec 'je', on utilise 'bois'.",
              "je boire": "C'est l'infinitif. Il faut conjuguer le verbe.",
              "je bu": "C'est le participe passé. Ici, on utilise le présent.",
              "bois": "N'oubliez pas le pronom personnel 'je'."
            }
          },
          "correctAnswer": "je bois",
          "feedback": {
            "default": "Le verbe 'boire' se conjugue: je bois, tu bois, il/elle boit, nous buvons, vous buvez, ils/elles boivent",
            "hint": "Pensez à la conjugaison irrégulière du verbe 'boire' au présent"
          },
          "points": 10,
          "timeLimit": 30,
          "tags": ["verbe", "présent", "irrégulier", "boire"]
        }
      ];
