import { User, Uploader, Article } from '../types';
import { NEWS_TOPICS } from '../constants';

const USERS_KEY = 'skynetnews_users';
const UPLOADERS_KEY = 'skynetnews_uploaders';
const ARTICLES_KEY = 'skynetnews_articles';
const CURRENT_USER_KEY = 'skynetnews_currentUser';
const CURRENT_UPLOADER_KEY = 'skynetnews_currentUploader';

// --- Mock Data Initialization ---
const initializeMockData = () => {
    if (!localStorage.getItem(ARTICLES_KEY)) {
        const mockArticles: Article[] = [
            {
                id: 'mock-1',
                title: 'Generative AI Redefines Creative Industries',
                summary: 'New models are now capable of producing stunning visuals and coherent text, challenging the boundaries of human creativity.',
                content: 'The landscape of creative industries is being rapidly reshaped by the advent of advanced generative AI. From graphic design to music composition, AI tools are no longer just assistants but collaborators. New models are now capable of producing stunning visuals from simple text prompts and generating coherent, context-aware articles on a wide range of topics. This technological leap challenges the very definition of creativity and raises important questions about authorship and intellectual property in an AI-augmented world. Artists and writers are exploring hybrid workflows, where human intuition guides the vast computational power of AI to create novel forms of art.',
                thumbnail: 'https://picsum.photos/seed/aiart/600/400',
                topics: ['Generative AI', 'Technology'],
                publishDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
                uploaderId: 'uploader-001',
                uploaderName: 'Jane Doe',
            },
            {
                id: 'mock-2',
                title: 'Breakthrough in Autonomous Drone Navigation',
                summary: 'Researchers have developed a new reinforcement learning algorithm that allows drones to navigate complex environments without GPS.',
                content: 'A significant breakthrough in autonomous systems has been achieved by a team of researchers specializing in robotics. They have developed a novel reinforcement learning algorithm that enables drones to navigate cluttered and dynamic environments with unprecedented accuracy, all without relying on GPS signals. The system uses a combination of onboard cameras and lidar to build a real-time 3D map of its surroundings, making intelligent decisions to avoid obstacles and find the most efficient path. This technology has vast implications for search and rescue operations, automated logistics, and infrastructure inspection, especially in areas where GPS is unreliable or unavailable.',
                thumbnail: 'https://picsum.photos/seed/drone/600/400',
                topics: ['Technology', 'Defence'],
                publishDate: new Date().toISOString(),
                uploaderId: 'uploader-001',
                uploaderName: 'Jane Doe',
            },
            {
                id: 'mock-3',
                title: 'City United Wins Championship in Stunning Final',
                summary: 'A last-minute goal secured the victory for City United in a dramatic conclusion to the season.',
                content: 'In a nail-biting final that will be remembered for years to come, City United clinched the championship title with a dramatic goal in the final seconds of stoppage time. The match was a tense affair, with both teams displaying incredible skill and determination. The deciding goal came from a spectacular long-range shot that left the opposing goalkeeper with no chance. Fans erupted in celebration as the final whistle blew, marking the culmination of a remarkable season for the underdog team. The victory parade is scheduled for Tuesday, where the team will celebrate with their loyal supporters.',
                thumbnail: 'https://picsum.photos/seed/soccer/600/400',
                topics: ['Sports', 'Entertainment'],
                publishDate: new Date().toISOString(),
                uploaderId: 'uploader-001',
                uploaderName: 'Jane Doe',
            }
        ];
        localStorage.setItem(ARTICLES_KEY, JSON.stringify(mockArticles));
    }

    if (!localStorage.getItem(UPLOADERS_KEY)) {
        const mockUploader: Uploader = {
            id: 'uploader-001',
            name: 'Jane Doe',
            age: 34,
            qualification: 'Masters in Journalism',
            qualificationProof: ''
        };
        localStorage.setItem(UPLOADERS_KEY, JSON.stringify([mockUploader]));
    }
};

initializeMockData();

// --- User Management ---
export const getUsers = (): User[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
};

export const saveUser = (user: User): boolean => {
    const users = getUsers();
    if (users.some(u => u.email === user.email)) {
        return false; // Email already exists
    }
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
};

export const loginUser = (email: string): User | null => {
    const users = getUsers();
    const user = users.find(u => u.email === email);
    if(user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
    return user || null;
}

export const getCurrentUser = (): User | null => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
}

export const logoutUser = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
}

// --- Uploader Management ---
export const getUploaders = (): Uploader[] => {
    const uploaders = localStorage.getItem(UPLOADERS_KEY);
    return uploaders ? JSON.parse(uploaders) : [];
};

export const saveUploader = (uploader: Uploader) => {
    const uploaders = getUploaders();
    uploaders.push(uploader);
    localStorage.setItem(UPLOADERS_KEY, JSON.stringify(uploaders));
};

export const getUploaderById = (id: string): Uploader | null => {
    const uploaders = getUploaders();
    const uploader = uploaders.find(u => u.id === id);
     if(uploader) {
        localStorage.setItem(CURRENT_UPLOADER_KEY, JSON.stringify(uploader));
    }
    return uploader || null;
}

export const getCurrentUploader = (): Uploader | null => {
    const uploader = localStorage.getItem(CURRENT_UPLOADER_KEY);
    return uploader ? JSON.parse(uploader) : null;
}

export const logoutUploader = () => {
    localStorage.removeItem(CURRENT_UPLOADER_KEY);
}

// --- Article Management ---
export const getArticles = (): Article[] => {
    const articles = localStorage.getItem(ARTICLES_KEY);
    const parsedArticles = articles ? JSON.parse(articles) : [];
    // Sort by date descending
    return parsedArticles.sort((a: Article, b: Article) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
};

export const saveArticle = (article: Article) => {
    const articles = getArticles();
    articles.unshift(article); // Add to the beginning
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
};
