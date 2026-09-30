const STORAGE_KEY = "good-things-recipes";

const sampleRecipes = [
  {
    id: "sample-1",
    name: "魚介たっぷりのパエリア",
    description: "米2合、えび6尾、ムール貝8個、玉ねぎ1/2個、にんにく1片、カットトマト100g、サフラン少々、ブイヨン400ml。",
    instructions: [
      "サフランを温めたブイヨンに浸しておく。玉ねぎとにんにくはみじん切りにする。",
      "大きめのフライパンにオリーブオイルを熱し、えびとムール貝をさっと焼いて取り出す。",
      "同じフライパンで玉ねぎとにんにくを炒め、トマトを加える。米を入れて全体に油をなじませる。",
      "サフラン入りブイヨンを注ぎ、沸騰したら弱火でふたをせず15〜18分炊く。途中でかき混ぜない。",
      "魚介を戻してふたをし、火を止めて5分蒸らす。好みでレモンを添える。"
    ],
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "sample-2",
    name: "クリームチーズのベーグル",
    description: "ベーグル1個、クリームチーズ30g、スモークサーモン2枚、薄切り玉ねぎ、ケッパー少々。",
    instructions: [
      "ベーグルを横半分に切り、トースターで軽く焼く。",
      "両面にクリームチーズを塗り、スモークサーモンと薄切り玉ねぎをのせる。",
      "ケッパーを散らしてもう片方のベーグルを重ねる。"
    ],
    image: "https://images.unsplash.com/photo-1687175452217-e4f8e523b5b5?auto=format&fit=crop&w=900&q=85"
  }
];

const recipeImages = [
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85"
];

const form = document.querySelector("#recipe-form");
const nameInput = document.querySelector("#recipe-name");
const descriptionInput = document.querySelector("#recipe-description");
const instructionsInput = document.querySelector("#recipe-instructions");
const recipeList = document.querySelector("#recipe-list");
const recipeCount = document.querySelector("#recipe-count");
const emptyState = document.querySelector("#empty-state");
const recipeDialog = document.querySelector("#recipe-dialog");
const dialogImage = document.querySelector("#recipe-dialog-image");
const dialogTitle = document.querySelector("#recipe-dialog-title");
const dialogDescription = document.querySelector("#recipe-dialog-description");
const dialogSteps = document.querySelector("#recipe-dialog-steps");
const dialogEmpty = document.querySelector("#recipe-dialog-empty");

function loadRecipes() {
  try {
    const savedRecipes = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(savedRecipes)) {
      return savedRecipes.filter((recipe) =>
        recipe && typeof recipe.id === "string" &&
        typeof recipe.name === "string" &&
        typeof recipe.description === "string" &&
        typeof recipe.image === "string"
      );
    }
  } catch {
    // Use the starter recipes when saved data is unavailable.
  }

  return sampleRecipes.map((recipe) => ({ ...recipe }));
}

let recipes = loadRecipes();

function saveRecipes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  } catch {
    // The list remains usable for this visit when storage is unavailable.
  }
}

function showRecipe(recipe) {
  dialogImage.src = recipe.image;
  dialogImage.alt = recipe.name;
  dialogTitle.textContent = recipe.name;
  dialogDescription.textContent = recipe.description;

  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions.filter((step) => typeof step === "string" && step.trim())
    : [];
  dialogSteps.replaceChildren(...instructions.map((step) => {
    const item = document.createElement("li");
    item.textContent = step;
    return item;
  }));
  dialogSteps.hidden = instructions.length === 0;
  dialogEmpty.hidden = instructions.length > 0;
  recipeDialog.showModal();
}

function makeRecipeCard(recipe, index) {
  const card = document.createElement("article");
  card.className = "recipe-card";

  const imageWrap = document.createElement("div");
  imageWrap.className = "recipe-image-wrap";

  const imageButton = document.createElement("button");
  imageButton.className = "recipe-image-button";
  imageButton.type = "button";
  imageButton.setAttribute("aria-label", `「${recipe.name}」の作り方を見る`);

  const image = document.createElement("img");
  image.className = "recipe-image";
  image.src = recipe.image;
  image.alt = recipe.name;
  image.loading = "lazy";
  imageButton.append(image);
  imageButton.addEventListener("click", () => showRecipe(recipe));
  imageWrap.append(imageButton);

  const indexBadge = document.createElement("span");
  indexBadge.className = "recipe-index";
  indexBadge.textContent = `レシピ ${String(index + 1).padStart(2, "0")}`;
  imageWrap.append(indexBadge);

  const body = document.createElement("div");
  body.className = "recipe-body";

  const title = document.createElement("h3");
  title.textContent = recipe.name;

  const description = document.createElement("p");
  description.className = "recipe-description";
  description.textContent = recipe.description;

  const footer = document.createElement("div");
  footer.className = "recipe-card-footer";

  const note = document.createElement("span");
  note.className = "recipe-note";
  note.textContent = "作ってみたい一品";

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.setAttribute("aria-label", `「${recipe.name}」を削除`);
  deleteButton.title = "レシピを削除";
  deleteButton.textContent = "×";
  deleteButton.addEventListener("click", () => {
    recipes = recipes.filter((item) => item.id !== recipe.id);
    saveRecipes();
    renderRecipes();
  });

  footer.append(note, deleteButton);
  body.append(title, description, footer);
  card.append(imageWrap, body);
  return card;
}

function renderRecipes() {
  recipeList.replaceChildren(...recipes.map(makeRecipeCard));
  recipeCount.textContent = `${recipes.length} 件`;
  emptyState.hidden = recipes.length > 0;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const description = descriptionInput.value.trim();
  const instructions = instructionsInput.value
    .split(/\r?\n/)
    .map((step) => step.trim())
    .filter(Boolean);
  if (!name || !description || instructions.length === 0) return;

  recipes.unshift({
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    name,
    description,
    instructions,
    image: recipeImages[recipes.length % recipeImages.length]
  });

  saveRecipes();
  renderRecipes();
  form.reset();
  nameInput.focus();
});

document.querySelector("#recipe-dialog-close").addEventListener("click", () => recipeDialog.close());
recipeDialog.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    recipeDialog.close();
  }
});
recipeDialog.addEventListener("click", (event) => {
  if (event.target === recipeDialog) recipeDialog.close();
});

renderRecipes();