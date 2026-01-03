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
            company: "Jamia Millia Islamia",
            duration: "2023–Present",
            description: "Developing high-performance C++ libraries for PPI analysis and de novo assembly algorithms."
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
            title: "annotaR",
            tech: "R, CRAN",
            description: "Statistical R package for automated genomic annotation and interval management. Successfully submitted to CRAN.",
            cruelDescription: "Survived CRAN's manual review process (almost). Solves the 'one-off error' hell of genomic intervals. It's basically a wrapper around GRanges but with sane defaults so users don't have to read 50 pages of Bioconductor docs.",
            link: "https://github.com/Sulkysubject37/annotaR"
        },
        {
            title: "GAI Analyzer",
            tech: "R, Shiny, ADMET",
            description: "Production-grade ADMET profiling toolkit. Integrates ADMETlab 3.0 and SwissADME data for standardized drug discovery indexing.",
            cruelDescription: "Shiny app that standardizes drug properties. Because relying on raw CSVs from three different webservers with different units is a recipe for disaster. Weighted aggregation model is mathematically rigorous, unlike most 'AI' drug discovery claims.",
            link: "https://sulkysubject37.shinyapps.io/GAI-Analyzer/"
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
            cruelDescription: "Experimental R package. recursive transformers on gene data. It's weird, it's distinct, and it mostly works.",
            link: "#"
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
        "C++20", "R (CRAN)", "Python", "CMake", "Catch2",
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