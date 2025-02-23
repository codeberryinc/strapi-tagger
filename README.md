# **Tagger - Strapi Plugin**  
**Powerful tagging for Strapi with auto-suggestions, custom fields, and automatic tag creation.**

> **✅ Compatible with Strapi v5.10.3 and above** 

![Strapi Version](https://img.shields.io/badge/Strapi-v5.10.3+-purple?style=flat-square)  
![License](https://img.shields.io/github/license/codeberryinc/strapi-tagger?style=flat-square)
![NPM Version](https://img.shields.io/npm/v/@codeberry/tagger?style=flat-square)

----------

## **✨ Features**

✅ **Custom Field Integration** → Attach a **Tag input** to any collection type.  
✅ **Auto-Suggestions** → Fetch **existing tags dynamically** as users type.  
✅ **Automatic Tag Creation** → **New tags are auto-created** when saving an entry.  
✅ **Fully Configurable** → Define where to store tags using the **Strapi UID field**.  
✅ **Lifecycle Hooks** → Works on `afterCreate`, `afterUpdate`, and `afterPublish` events.  
✅ **REST & GraphQL Compatible** → Query articles by tags with ease.

----------

## **📦 Installation**

```bash
npm install @codeberry/tagger

```

or using yarn:

```bash
yarn add @codeberry/tagger

```

Then, **enable the plugin** in `config/plugins.ts`:

```ts
export default {
  tagger: {
    enabled: true,
    config: {
      tagConfig: {
        model: "api::tag.tag", // ✅ Use the UID field from Strapi
        titleField: "title", // ✅ Field for tag name
        slugField: "slug", // ✅ Field for slug (must be a UID field)
      },
    },
  },
};

```

----------

## **🛠️ Configuration**

### **1️⃣ Creating the Tag Collection**

Before using the plugin, **you need to create a collection for storing tags.**  
📌 **It is recommended that the `slug` field is a `UID` field in Strapi, but you could use a string as well.**

#### **Steps to create the Tag collection:**

-   Navigate to **Content-Types Builder**
-   Click **Create Collection Type**
-   Name it **Tag** (or any other name you prefer)
-   Click **Add another field**, then add:
    -   **Text Field** → `title`
    -   **UID Field** → `slug` (Make sure it auto-generates from `title`)
-   **Save & Restart Strapi**

### **2️⃣ Ensuring API Access for Auto-Suggestions**

📌 **Ensure the `Tag` collection has the appropriate permissions to be queried** by the public or authenticated users.

-   Go to **Settings** → **Roles & Permissions**
-   Select the **Public** role
-   Under **Permissions**, find **Tag (or the collection name you used)**
-   Enable **Find & FindOne** (so the API can suggest tags)
-   (Optional) Repeat for the **Authenticated** role if needed

**Save the settings and restart Strapi.**

----------

### **3️⃣ Attaching the Tag Field to a Collection**

You can attach the **Tagger Custom Field** to any Strapi Collection:

-   **Go to Content-Types Builder**
-   Open the **Article (or any other)** collection
-   Click **Add another field** → **Custom Field**
-   Select **Tags** (`select tags`)
-   **Save & Restart Strapi**

Once added, you'll see a **multi-select tag input field** in the **Strapi Admin Panel**.

----------

## **📡 Usage**

### **1️⃣ Typing Tags in the Input Field**

-   **Auto-suggestions** appear based on the existing tags.
-   **New tags** can be created dynamically.

### **2️⃣ Querying Articles by Tags**

#### **REST API**

```bash
GET /api/articles?filters[tags][$contains]=tagname

```

#### **GraphQL**

```graphql
query Articles {
  articles(filters: { tags: { contains: ["tag1", "tag2", "tag3"] } }) {
    documentId
    title
    tags
  }
}

```

----------

## **🔄 Lifecycle Hooks**

The plugin **automatically processes tags** when creating, updating, or publishing content.  
✅ Runs on **`afterCreate`, `afterUpdate`, and `afterPublish`**.  
✅ **New tags are auto-created** if they don’t exist.  
✅ **Prevents duplicate tags** by checking against the slug.

----------

## **💡 Best Practices**

✅ **Always Use the UID Field** → When configuring `model` in `config/plugins.ts`, **use the UID field** from Strapi.  
✅ **Enable API Permissions** → Ensure the **Tag collection is accessible** for auto-suggestions.  
✅ **Use Unique Slugs** → Slugs ensure tags remain unique and SEO-friendly.

----------

## **🛠 Troubleshooting**

### **1️⃣ The Plugin Doesn't Show in Strapi**

-   Ensure the plugin is installed and enabled in `config/plugins.ts`.
-   Restart Strapi using:
    
    ```bash
    npm run build && npm run develop
    
    ```
    

### **2️⃣ Tags Are Not Being Created**

-   Make sure the `titleField` and `slugField` exist in your tag model.
-   **Check logs** for errors:
    
    ```bash
    npm run develop --debug
    
    ```
    

### **3️⃣ Auto-Suggestions Aren’t Working**

-   Verify the **API response** for tag suggestions:
    
    ```bash
    GET /api/tags?fields[0]=title&filters[title][$containsi]=keyword
    
    ```
    

----------

## **📜 License**

This project is **open-source** and licensed under the **MIT License**.

🚀 **Contributions & PRs are welcome!** Let’s make tagging in Strapi even better! 🎉

----------

## **🔗 Links**

-   📖 **Strapi Docs** → [https://docs.strapi.io](https://docs.strapi.io/)
-   🛠 **GitHub Repository** → [https://github.com/codeberryinc/strapi-tagger](https://github.com/codeberryinc/strapi-tagger)

----------

### **🔥 Get Started with @codeberry/tagger Today!**

🚀 **Powerful Tagging for Your Strapi Content – Install Now!** 🎉
