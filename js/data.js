const portfolioData = {
    about: {
        name: "MD. Arshad",
        title: "Research Software Engineer | Systems Biologist | AI Engineer | Bioinformatician",
        bio: "Innovative Research Software Engineer and Systems Biologist bridging the gap between high-performance systems programming (C++) and statistical biology (R). I build rigorous, reproducible, and scalable solutions under the 'Cruel Standard': systems must fail loudly and safely rather than hallucinate or mislead. Experienced in building explainable deep learning frameworks, de novo assemblers, and graph neural networks for biological interpretation.",
        cruelBio: "KERNEL PANIC IF HALLUCINATION DETECTED. I refuse to write 'AI for Good' fluff. I write C++20 because Python is too slow for 100M+ edges, and I write R because biologists refuse to learn anything else. My code asserts aggressively. If your data is garbage, my software will crash and tell you exactly why, rather than giving you a pretty p-value. Currently burning GPU cycles training LLMs to say 'I don't know' instead of lying.",
        location: "New Delhi, India",
        email: "arshad10867c@gmail.com",
        social: {
            github: "https://github.com/Sulkysubject37",
            linkedin: "https://www.linkedin.com/in/subjects/",
            twitter: "https://x.com/sulkysubject",
            blog: "https://subconc.hashnode.dev/"
        }
    },
    education: [
        {
            degree: "M.Sc. in Bioinformatics",
            institution: "Jamia Millia Islamia",
            duration: "2025–2027",
            details: "Coursework: Structural Bioinformatics, Systems Biology, Computational Genomics, AI/ML in Biology. Focus on Algorithm Design and Network Analysis."
        },
        {
            degree: "B.Sc. in Bioinformatics",
            institution: "MAKAUT, WB",
            duration: "2022–2025",
            details: "Key Projects: Alzheimer’s prediction (NACC & ADNI), DNA data storage, Inflammasome biomarkers. Seminar: Protein Fold & Profiling of Protein Sequence (2024). CGPA: 8.49"
        }
    ],
    experience: [
        {
            role: "Research Software Engineer",
            company: "Independent",
            duration: "2023–Present",
            description: "Developing high-performance C++ libraries for PPI analysis and de novo assembly algorithms. Focused on open-source community tools and interpretable bioinformatics."
        },
        {
            role: "Open Source Maintainer",
            company: "GitHub",
            duration: "2023–Present",
            description: "Maintainer of 'tangle', 'jinxembler', and 'annotaR'. Focused on systems biology tools and algorithmic rigor."
        },
        {
            role: "Student Leader, NSS Unit",
            company: "NSS",
            duration: "2023–2025",
            description: "Led interdisciplinary outreach and community projects."
        },
        {
            role: "Auditor",
            company: "OET",
            duration: "2023–2025",
            description: "Conducted quality and compliance checks ensuring data accuracy in large-scale assessments."
        }
    ],
    projects: [
        {
            title: "VECTORIA",
            tech: "C++17, Assembly (SIMD), Python, Swift",
            description: "Deterministic, inspectable computational kernel framework. Features arena-based memory, frozen IR graph, and full execution tracing.",
            cruelDescription: "Enforces strict 'Reference-as-Truth' semantics. Bitwise intra-platform determinism verified by multi-op stress tests. Hand-tuned ARM64 NEON and AVX2 kernels because compilers aren't smart enough yet. 100% CI pass rate on Apple Silicon and Linux.",
            link: "https://github.com/Sulkysubject37/vectoria"
        },
        {
            title: "jinxembler",
            tech: "C++20, Python, CMake",
            description: "High-performance de novo transcriptome assembler using 2-bit k-mer encoding and Tarjan's SCC algorithm. 100% precision on synthetic benchmarks.",
            cruelDescription: "Implements strict De Bruijn Graph invariants. Uses 2-bit packing (std::vector<bool> is a lie, used custom bitset) to fit 60k reads in <1GB RAM. Debugging Tarjan's SCC implementation induced mild insanity. Python bindings exist only because pure C++ scares the users.",
            link: "https://github.com/Sulkysubject37/jinxembler"
        },
        {
            title: "Atlas Deconvolve",
            tech: "Python, PyTorch, GATv2",
            description: "Graph Variational Autoencoder (GVAE) for deconvolving Protein-Protein Interaction networks. Implements 'Encode-then-Cluster' strategy for module discovery.",
            cruelDescription: "GVAE with GATv2 because simple GCNs over-smooth. 'Encode-then-Cluster' is just fancy K-Means on latent space, but it works. Deconvolves the 'hairball' structures that Cytoscape chokes on. >0.99 ROC-AUC (yes, on held-out edges, I checked for leakage).",
            link: "https://github.com/Sulkysubject37/Atlas_Deconvolve"
        },
        {
            title: "tangle",
            tech: "C++, FTXUI, Threads",
            description: "Systems-level PPI network analysis library with a responsive TUI. Features async loading, Louvain clustering, and SBML export.",
            cruelDescription: "A TUI because web apps are bloated. Uses std::thread for async loading so the UI doesn't freeze when parsing 5GB STRING files. Manual mutex management for shared state because I enjoy pain. SBML export is technically correct, which is the best kind of correct.",
            link: "https://github.com/Sulkysubject37/tangle"
        },
        {
            title: "cruel-gemma",
            tech: "Python, MLX, LLMs",
            description: "Fine-tuning Gemma 3 (4B) on Apple Silicon for biological reasoning. Enforces strict refusal of hallucinations via a custom 'Cruel Standard' dataset.",
            cruelDescription: "Training LLMs to SHUT UP when they don't know the answer. Running 4B param models on a MacBook using MLX because CUDA is for people with cloud budgets. Implemented a custom 'OOM Kill-Switch' that saves weights before Metal crashes the kernel.",
            link: "https://github.com/Sulkysubject37/cruel-gemma"
        },
        {
            title: "resLIK (R Package)",
            tech: "R, RLCS, Systems Safety",
            description: "Implements the Representation-Level Control Surfaces (RLCS) paradigm for ensuring the reliability of autonomous systems and AI models. It provides three deterministic sensors: Residual Likelihood (ResLik), Temporal Consistency Sensor (TCS), and Agreement Sensor.",
            cruelDescription: "Implements RLCS invariants because 'trust me' isn't a safety protocol. Uses ResLik and TCS to catch distribution shifts before they kill the system. It's not 'anomaly detection', it's 'statistical governance'. PROCEED, DEFER, or ABSTAIN; there is no 'maybe'.",
            link: "https://sulkysubject37.r-universe.dev/resLIK"
        },
        {
            title: "annotaR: Tidy, Integrated Gene Annotation",
            tech: "R, CRAN, R-Universe",
            description: "A framework for intuitive, multi-source gene and protein annotation, with a focus on integrating functional genomics with disease and drug data for translational insights.",
            cruelDescription: "Survived CRAN's manual review process (mostly). Solves the 'one-off error' hell of genomic intervals. It's a wrapper around GRanges but with sane defaults so biologists don't have to read 50 pages of Bioconductor docs.",
            link: "https://sulkysubject37.r-universe.dev/annotaR"
        },
        {
            title: "GAI Analyzer",
            tech: "R, Shiny, ADMET",
            description: "Production-grade ADMET profiling toolkit. Integrates ADMETlab 3.0 and SwissADME data for standardized drug discovery indexing.",
            cruelDescription: "Shiny app that standardizes drug properties. Because relying on raw CSVs from three different webservers with different units is a recipe for disaster. Weighted aggregation model is mathematically rigorous, unlike most 'AI' drug discovery claims.",
            link: "https://sulkysubject37.shinyapps.io/GAI-Analyzer/"
        },
        {
            title: "trace-seq",
            tech: "C++, Python, R",
            description: "A comprehensive toolkit for phylogenetic lineage tracing and analysis. Features robust project root detection and bindings for Python and R.",
            cruelDescription: "Implemented cross-language bindings (pybind11, Rcpp) because data scientists refuse to use the command line. Solved the 'where am I running from?' path resolution hell in C++ so you don't have to.",
            link: "https://github.com/Sulkysubject37/trace-seq"
        },
        {
            title: "KORA",
            tech: "Python, Swift, Spiking Neural Networks, CoreML",
            description: "Kinetic Ordered Regulatory Analysis. Pipeline for inferring Gene Regulatory Networks (GRNs) from transcriptomic data. Includes a Swift application for inference and benchmarking.",
            cruelDescription: "Training SNNs on CPU because neuromorphic hardware is expensive. Exported cohorts to CoreML for edge inference. Swift benchmarking proved 10x throughput on local hardware compared to cloud-based inference scripts.",
            link: "https://github.com/Sulkysubject37/kora"
        },
        {
            title: "Causal STDP",
            tech: "Python, Brian2, Covid-19 Transcriptomics",
            description: "Biologically inspired pipeline for inferring directed Gene Regulatory Networks (GRNs) from COVID-19 transcriptomics (GSE215865, GSE157859). Identified top regulators including PHC2 and NSA2.",
            cruelDescription: "Recovered directed GRNs above chance level (Precision ~0.28 vs Chance 0.15) using pair-based STDP learning. Validated via temporal permutation and negative control diagnostics. If your causal trace doesn't survive a shuffle test, it's just noise.",
            link: "https://github.com/Sulkysubject37/c-stdp"
        },
        {
            title: "Operation Subjects",
            tech: "Python, BLAST, MEME, Biopython",
            description: "A comprehensive bioinformatics sequence analysis suite featuring quality control, sequence alignment, motif discovery, and genomic feature analysis capabilities.",
            cruelDescription: "My first 'big' python script. It wraps BLAST and MEME. It works, but don't look at the code. It's a monolith. We all start somewhere.",
            link: "https://github.com/Sulkysubject37/operation-subjects"
        },
        {
            title: "Machine Learning & Bioinformatics in Alzheimer’s Disease",
            tech: "GAT-ResNet, SHAP, Knowledge Graphs",
            description: "Analyzed NACC datasets. Built GAT-ResNet frameworks integrating multimodal biomarkers and applied explainable AI for interpretability.",
            cruelDescription: "Applied GAT-ResNet to NACC data. SHAP values proved that the model wasn't just learning noise. Interpretable AI is the only AI allowed in medicine.",
            link: "#"
        },
        {
            title: "Algorithmic Approach to DNA Data Storage",
            tech: "Python, Error Correction",
            description: "Developed Python algorithms for binary data encoding/decoding into DNA sequences with robust error correction and modular pipeline design.",
            cruelDescription: "Encoding binaries into A, T, G, C. Implemented Reed-Solomon because DNA synthesis is error-prone. It's slow, but it stores data for 10,000 years. Beat that, SSD.",
            link: "#"
        },
        {
            title: "Variational Quantum Eigensolver Pipeline",
            tech: "Python, MATLAB, Quantum Algorithms",
            description: "Built hybrid workflows applying optimization methods for computational biology datasets and molecular energy estimation.",
            cruelDescription: "Simulating quantum computers on classical hardware to solve protein folding. It's painfully slow, but the math checks out. VQE is the future, just not today.",
            link: "#"
        },
        {
            title: "Cancer Biomarker Research",
            tech: "Pathway Mapping",
            description: "Investigated NLRC4 inflammasome biomarkers; conducted pathway mapping and published findings in Human Gene (Elsevier).",
            cruelDescription: "Standard diff-exp analysis pipeline, but rigorous. Validated with literature. Published in Elsevier, so at least one reviewer thought it was solid.",
            link: "#"
        },
        {
            title: "BioMoR: R package for bioinformatics modeling",
            tech: "R, Autoencoders, Random Forest",
            description: "Bioinformatics Modeling with Recursion and Autoencoder-Based Ensemble using recursive transformer-inspired architectures.",
            cruelDescription: "Recursive transformers for gene data because linear models are too naive for biology. It forces structural priors onto latent representations. Available on R-Universe for those who want to see where bioinformatics meets information theory.",
            link: "https://sulkysubject37.r-universe.dev/BioMoR"
        },
        {
            title: "Chemical–Biological Dynamics Modeling",
            tech: "R, Stochastic Modeling",
            description: "Developed computational models simulating chemical–biological interactions; implemented stochastic and deterministic processes.",
            cruelDescription: "Gillespie algorithm implementation. Stochastic noise is feature, not a bug.",
            link: "#"
        },
        {
            title: "Monte Carlo Finance (R)",
            tech: "R, Monte Carlo Simulations",
            description: "Created R-based Monte Carlo simulations applicable to stochastic biological systems and quantitative modeling.",
            cruelDescription: "Proof I can do math outside of biology. Monte Carlo sims are universal.",
            link: "#"
        },
        {
            title: "SINDy–HMM Framework",
            tech: "SINDy, HMM",
            description: "Developed interpretable framework combining SINDy and HMM for transient acoustic segmentation.",
            cruelDescription: "Sparse Identification of Nonlinear Dynamics. Finding the differential equations governing the system from data alone. Black box models are for cowards.",
            link: "#"
        }
    ],
    skills: [
        "C++20", "Assembly (SIMD)", "R (CRAN)", "Python", "Swift", "Shell Scripting", "CMake", "Catch2",
        "MLX", "PyTorch", "GNN", "Bioinformatics",
        "Systems Biology", "Graph Theory", "TUI (FTXUI)",
        "Shiny", "FastAPI", "Docker", "Git", "SHAP"
    ],
    publications: [
        "Arshad, M. (In Prep). Deconvolving PPI Networks using Graph Variational Autoencoders. PLOS Computational Biology.",
        "Arshad, M. (Submitted). annotaR: Automated Annotation for Genomic Intervals. CRAN.",
        "Arshad, M., Mal, C., Das, S., & Bhattacharyya, D. (2024). The potential of the NLRC4 inflammasome as a cancer biomarker: A pan-cancer investigation. Human Gene, 42(8). DOI:10.1016/j.humgen.2024.201351",
        "Arshad, M., & Mal, C. (Under review). MIKU: A multi-modal integrated knowledge-guided unified model for Alzheimer’s disease prediction. 3 Biotech.",
        "Arshad, M., & Md, S. A. (Under review). Deep learning in Huntington’s disease: Advances in prediction, biomarkers, and progression modeling. Journal of Huntington’s Disease.",
        "Arshad, M. (In submission). SINDy-MUSE: An interpretable dynamics and structure modeling . IEEE/ACM"
    ],
    interests: [
        "Systems Programming", "Network Biology", "Quantum Computing", "Algorithmic Rigor", "Open Source"
    ],
    posts: [
        {
            title: "Hope: A Socioeconomic Loss",
            date: "Apr 2, 2026",
            summary: "A cold, structural analysis of hope as a systemic miscalibration. Dissecting the socioeconomic and theological costs of expectation without kinetic execution.",
            link: "posts/2026-04-02_Hope-A-Socioeconomic-Loss.html"
        },
        {
            title: "Why Protein Networks Need a C++ Revolution: The Story Behind tangle",
            date: "Dec 8, 2025",
            summary: "A deep dive into why high-performance systems programming is essential for modern PPI network analysis and the engineering philosophy of tangle.",
            link: "https://subconc.hashnode.dev/tangle"
        },
        {
            title: "Detested Poets #1: Charles Bukowski, The Laureate of the Gutter",
            date: "Nov 19, 2025",
            summary: "The first entry in the 'Detested Poets' series, dissecting the controversial and overrated figure of Charles Bukowski.",
            link: "https://subconc.hashnode.dev/charles-bukowski"
        },
        {
            title: "Operation Subjects: A Bioinformatics Suite That Eats Its Own Jobs",
            date: "Nov 15, 2025",
            summary: "Solving the installation and dependency hell of bioinformatics tools with a robust, automated sequence analysis suite.",
            link: "https://subconc.hashnode.dev/operation-subjects"
        },
        {
            title: "Don't Follow the Trend: The Niche Contrarian Manifesto",
            date: "Nov 14, 2025",
            summary: "In a world of convergence and 'hot' topics, this manifesto argues for the power of niche expertise and algorithmic rigor.",
            link: "https://subconc.hashnode.dev/niche-contrarian"
        },
        {
            title: "MuseDNA: Composing a Symphony from the Code of Life",
            date: "Nov 13, 2025",
            summary: "Translating biological sequences into audible symphonies. A journey into DNA data storage and sonic information theory.",
            link: "https://subconc.hashnode.dev/muse-dna"
        },
        {
            title: "Deconstructing the Baroque Binary: An Analysis of Rosalía's 'Berghain'",
            date: "Nov 12, 2025",
            summary: "A conceptual and technical analysis of Rosalía's sonic borderlands, where flamenco meets industrial techno.",
            link: "https://subconc.hashnode.dev/rosalia-berghain"
        },
        {
            title: "The Ecstatic Conversation: How Jazz and Qawwali Speak the Same Musical Language",
            date: "Nov 9, 2025",
            summary: "Exploring the driving rhythms and soaring vocals that bridge the gap between South Asian Sufi music and American Jazz.",
            link: "https://subconc.hashnode.dev/the-ecstatic-conversation-how-jazz-and-qawwali-speak-the-same-musical-language"
        },
        {
            title: "The Fractured Glass: Who Are You When No One is Watching?",
            date: "Sept 25, 2025",
            summary: "A poetic exploration of the self. When the crowd fades and the masks come off, who do we become? An inquiry into the quiet hypocrisy and the shadow self.",
            link: "posts/2025-09-25_The-Fractured-Glass--Who-Are-You-When-No-One-is-Watching--1ef39cc3803c.html"
        },
        {
            title: "The Finer Print: Death’s Curse on the Promise of Tomorrow",
            date: "Sept 13, 2025",
            summary: "What if the promise of delayed gratification is a lie? Exploring how mortality curses our pursuit of future solace and how to find meaning through process gratification.",
            link: "posts/2025-09-13_The-Finer-Print--Death-s-Curse-on-the-Promise-of-Tomorrow-aa3018054709.html"
        },
        {
            title: "We Are Not Apex Predators, We Are Apex 'Bullshitters'",
            date: "Sept 5, 2025",
            summary: "Justice isn’t a natural law; it’s a human invention. Explore why exploitation persists because we’ve perfected the art of justifying it.",
            link: "posts/2025-09-05_We-Are-Not-Apex-Predators--We-Are-Apex--Bullshitters--b16440e672c2.html"
        },
        {
            title: "The Power of Stupidity: Why It’s More Dangerous Than Evil",
            date: "Aug 23, 2025",
            summary: "Dietrich Bonhoeffer warned that stupidity is a greater threat than evil. Explore the psychology behind this force, from cognitive dissonance to modern manifestations.",
            link: "posts/2025-08-23_The-Power-of-Stupidity--Why-It-s-More-Dangerous-Than-Evil-08af2c6a3d1c.html"
        },
        {
            title: "The Duality of Existence: How Opposites Define Art, Psychology, and Literature",
            date: "Aug 6, 2025",
            summary: "Life’s most profound truths are found in balance. Exploring how visual and emotional contrasts reveal deeper truths in art and storytelling.",
            link: "posts/2025-08-06_The-Duality-of-Existence--How-Opposites-Define-Art--Psychology--and-Literature-07234a468490.html"
        },
        {
            title: "Are We Just Tools or Enemies? The Politician’s Dichotomy",
            date: "May 3, 2025",
            summary: "Nietzsche’s dissection of power feels eerily prescient today. Are we just pawns in power plays? Or can we reclaim our humanity?",
            link: "posts/2025-05-03_Are-We-Just-Tools-or-Enemies--The-Politician-s-Dichotomy-and-Human-Agency-3bbacaa8ea37.html"
        },
        {
            title: "Peter Cat Recording Co.: Decoding the Alchemists of Sound",
            date: "Feb 3, 2025",
            summary: "A journey through the genre-defying music of PCRC. Meet the band, their ghosts, and the code that cracks their chaos.",
            link: "posts/2025-02-03_Peter-Cat-Recording-Co---940fba2ca86a.html"
        },
        {
            title: "Automate Your Finances in 10 Minutes with Python",
            date: "Jan 31, 2025",
            summary: "Learn how to automate budgeting, bill payments, and expense tracking using Python and Plaid API integration.",
            link: "posts/2025-01-31_Automate-Your-Finances-in-10-Minutes-with-Python--Track-Expenses--Pay-Bills---Save-Effortlessly-e8ad646f82bb.html"
        }
    ],
    quotes: [
        { text: "Systems must fail loudly and safely.", author: "The Cruel Standard" },
        { text: "Biology is a system of systems.", author: "Unknown" },
        { text: "The best way to predict the future is to invent it.", author: "Alan Kay" }
    ],
    bioQuotes: [
        { text: "Decoding life, one bit at a time.", author: "Sulkysubject37" },
        { text: "Biology is becoming a digital science.", author: "Leroy Hood" },
        { text: "In God we trust; all others must bring data.", author: "W. Edwards Deming" }
    ]
};