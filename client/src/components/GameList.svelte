<script lang="ts">
    import { onMount } from "svelte";

    interface Game {
        id: number;
        title: string;
        description: string;
        publisher_name?: string;
        category_name?: string;
        star_rating?: number;
    }

    export let games: Game[] = [];
    let loading = true;
    let error: string | null = null;

    const fetchGames = async () => {
        loading = true;
        try {
            const response = await fetch('/api/games');
            if(response.ok) {
                games = await response.json();
            } else {
                error = `Failed to fetch data: ${response.status} ${response.statusText}`;
            }
        } catch (err) {
            error = `Error: ${err instanceof Error ? err.message : String(err)}`;
        } finally {
            loading = false;
        }
    };

    const getRandomColor = () => {
        const colors = ['blue', 'purple', 'cyan', 'green', 'pink', 'yellow'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const generateStars = (rating: number = 4.5) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        return { fullStars, hasHalfStar };
    };

    onMount(() => {
        fetchGames();
    });
</script>

<div class="relative">
    <!-- Section header -->
    <div class="text-center mb-16">
        <div class="inline-flex items-center px-4 py-2 mb-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20 rounded-full text-blue-300 text-sm font-medium backdrop-blur-sm">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Featured Collection
        </div>
        <h2 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
            DevOps Board Games
        </h2>
        <p class="text-xl text-slate-400 max-w-3xl mx-auto">
            Strategic games that bring software development concepts to your tabletop
        </p>
    </div>
    
    {#if loading}
        <!-- Enhanced loading animation -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {#each Array(8) as _, i}
                <div class="group relative">
                    <div class="bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-900/60 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-slate-700/50 h-80">
                        <div class="p-6 h-full">
                            <div class="animate-pulse">
                                <!-- Card image placeholder -->
                                <div class="h-32 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded-xl mb-4 animate-shimmer"></div>
                                <!-- Title placeholder -->
                                <div class="h-6 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded-lg w-3/4 mb-3 animate-shimmer"></div>
                                <!-- Category placeholder -->
                                <div class="h-4 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded w-1/2 mb-4 animate-shimmer"></div>
                                <!-- Description placeholders -->
                                <div class="space-y-2">
                                    <div class="h-3 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded w-full animate-shimmer"></div>
                                    <div class="h-3 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded w-5/6 animate-shimmer"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {:else if error}
        <!-- Enhanced error display -->
        <div class="text-center py-20 bg-gradient-to-br from-red-900/20 via-slate-800/50 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-red-500/20">
            <div class="max-w-md mx-auto">
                <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold text-red-400 mb-2">Oops! Something went wrong</h3>
                <p class="text-red-300/80 text-sm">{error}</p>
            </div>
        </div>
    {:else if games.length === 0}
        <!-- Enhanced no games display -->
        <div class="text-center py-20 bg-gradient-to-br from-slate-800/50 via-slate-900/40 to-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50">
            <div class="max-w-md mx-auto">
                <div class="w-16 h-16 bg-slate-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold text-slate-300 mb-2">No games available</h3>
                <p class="text-slate-400 text-sm">Check back later for new DevOps adventures!</p>
            </div>
        </div>
    {:else}
        <!-- Enhanced game grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" data-testid="games-grid">
            {#each games as game, index (game.id)}
                <a 
                    href={`/game/${game.id}`} 
                    class="group relative transform transition-all duration-500 hover:scale-105"
                    data-testid="game-card"
                    data-game-id={game.id}
                    data-game-title={game.title}
                    style="animation-delay: {index * 100}ms"
                >
                    <!-- Card background with glassmorphism -->
                    <div class="relative bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-900/60 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-slate-700/50 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 h-80">
                        <!-- Hover overlay -->
                        <div class="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-purple-600/0 to-cyan-600/0 group-hover:from-blue-600/5 group-hover:via-purple-600/3 group-hover:to-cyan-600/5 transition-all duration-500"></div>
                        
                        <!-- Card content -->
                        <div class="relative z-10 p-6 h-full flex flex-col">
                            <!-- Game icon/image placeholder -->
                            <div class="w-full h-32 bg-gradient-to-br from-{getRandomColor()}-500/20 to-{getRandomColor()}-700/30 rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                <svg class="w-12 h-12 text-{getRandomColor()}-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                                </svg>
                            </div>
                            
                            <!-- Game title -->
                            <h3 class="text-xl font-bold text-slate-100 mb-2 group-hover:text-blue-400 transition-colors duration-300 line-clamp-2 flex-shrink-0" data-testid="game-title">
                                {game.title}
                            </h3>
                            
                            <!-- Tags -->
                            {#if game.category_name || game.publisher_name}
                                <div class="flex flex-wrap gap-2 mb-3 flex-shrink-0">
                                    {#if game.category_name}
                                        <span class="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20" data-testid="game-category">
                                            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
                                            </svg>
                                            {game.category_name}
                                        </span>
                                    {/if}
                                    {#if game.publisher_name}
                                        <span class="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20" data-testid="game-publisher">
                                            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                                            </svg>
                                            {game.publisher_name}
                                        </span>
                                    {/if}
                                </div>
                            {/if}
                            
                            <!-- Description -->
                            <p class="text-slate-400 text-sm leading-relaxed flex-grow line-clamp-3" data-testid="game-description">
                                {game.description}
                            </p>
                            
                            <!-- Rating and action -->
                            <div class="mt-4 flex items-center justify-between flex-shrink-0">
                                <!-- Star rating -->
                                <div class="flex items-center">
                                    {#each Array(generateStars(game.star_rating || 4.5).fullStars) as _}
                                        <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                        </svg>
                                    {/each}
                                    {#if generateStars(game.star_rating || 4.5).hasHalfStar}
                                        <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <defs>
                                                <linearGradient id="half">
                                                    <stop offset="50%" stop-color="currentColor"/>
                                                    <stop offset="50%" stop-color="transparent"/>
                                                </linearGradient>
                                            </defs>
                                            <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                        </svg>
                                    {/if}
                                    <span class="ml-1 text-xs text-slate-400">{(game.star_rating || 4.5).toFixed(1)}</span>
                                </div>
                                
                                <!-- View details -->
                                <div class="flex items-center text-sm font-medium text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                                    <span class="mr-1">Details</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            {/each}
        </div>
        
        <!-- Load more section -->
        <div class="text-center mt-12">
            <button class="group px-8 py-4 bg-gradient-to-r from-slate-700/50 to-slate-800/50 hover:from-blue-600/20 hover:to-purple-600/20 text-slate-300 hover:text-blue-300 font-medium rounded-xl border border-slate-600/50 hover:border-blue-500/50 backdrop-blur-sm transition-all duration-300 flex items-center mx-auto">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Load More Games
            </button>
        </div>
    {/if}
</div>

<style>
    @keyframes shimmer {
        0% {
            background-position: -200px 0;
        }
        100% {
            background-position: calc(200px + 100%) 0;
        }
    }
    
    .animate-shimmer {
        background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0px,
            rgba(255, 255, 255, 0.1) 50px,
            rgba(255, 255, 255, 0) 100px
        );
        background-size: 200px 100%;
        animation: shimmer 2s infinite linear;
    }
    
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>