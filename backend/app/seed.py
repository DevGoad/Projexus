from sqlalchemy.orm import Session
from app import models, auth

INITIAL_DOMAINS = [
    {
        "name": "ROBOTICS & MECHATRONICS",
        "slug": "robotics-mechatronics",
        "description": "Autonomous vehicles, manipulators, robotic automation, and control systems.",
    },
    {
        "name": "CIVIL & STRUCTURAL",
        "slug": "civil-structural",
        "description": "Smart infrastructure, structural health monitoring, geotechnics, and environmental design.",
    },
    {
        "name": "SOFTWARE & AI",
        "slug": "software-ai",
        "description": "Machine learning, web platforms, distributed systems, and intelligent applications.",
    },
    {
        "name": "ENERGY SYSTEMS",
        "slug": "energy-systems",
        "description": "Renewable power generation, microgrids, battery storage, and dynamic power distribution.",
    },
    {
        "name": "ELECTRICAL & ELECTRONICS",
        "slug": "electrical-electronics",
        "description": "Embedded hardware, VLSI, signal processing, and IoT systems.",
    },
    {
        "name": "MECHANICAL & AUTOMOTIVE",
        "slug": "mechanical-automotive",
        "description": "Thermal dynamics, fluid simulations, automotive powertrains, and CAD modeling.",
    },
]

DEMO_PROJECTS = [
    dict(
        title="Projexus — Student Project Showcase Platform",
        domain="SOFTWARE & AI",
        description="A platform connecting engineering talent with industry through production-ready project showcases. Recruiters browse verified student work by domain and readiness score.",
        problem_statement="Engineering graduates lack high-signal portfolios showcasing production readiness, while recruiters struggle to evaluate real technical competencies from traditional resumes.",
        team="Your Name, Teammate 2, Teammate 3",
        team_size=3,
        team_roles="Your Name (Full-Stack Architecture), Teammate 2 (Database & API), Teammate 3 (Design System)",
        year=2026,
        branch="Computer Science & Engineering",
        tags=["FastAPI", "Next.js", "SQLAlchemy"],
        tech_stack=["Python", "FastAPI", "Next.js", "PostgreSQL", "Tailwind CSS", "Docker"],
        github_url="https://github.com/projexus/showcase-core",
        demo_url="http://localhost:3000",
        docs_url="https://github.com/projexus/showcase-core#readme",
        demo_type="live_container",
        media_urls=["https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80"],
        # Checklist: 15 (desc) + 10 (tech) = 25%
        check_description=True,
        check_team=False,
        check_demo=False,
        check_docs=False,
        check_tech_stack=True,
        check_media=False,
        check_faculty_verified=False,
    ),
    dict(
        title="Smart Microgrid Load Balancer",
        domain="ENERGY SYSTEMS",
        description="Simulation and hardware prototype for dynamic load balancing across a campus microgrid with renewable sources.",
        problem_statement="Intermittent renewable generation from campus solar arrays leads to grid voltage instability and peak tariff penalties during rapid weather changes.",
        team="H. Bose, A. Chatterjee, M. Reddy, S. Dutta",
        team_size=4,
        team_roles="H. Bose (Power Systems Modeling), A. Chatterjee (Control Logic), M. Reddy (Embedded Controller), S. Dutta (Sensor telemetry)",
        year=2026,
        branch="Energy Systems Engineering",
        tags=["Microgrid", "Simulink", "Load balancing"],
        tech_stack=["Simulink", "MATLAB", "Python", "Raspberry Pi", "Modbus TCP", "MQTT"],
        github_url="https://github.com/demo/microgrid-balancer",
        demo_url="https://demo.projexus.io/microgrid-sim",
        docs_url="https://demo.projexus.io/docs/microgrid-spec.pdf",
        demo_type="simulation_media",
        media_urls=[
            "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1200&q=80",
        ],
        # Checklist: all checked = 100%
        check_description=True,
        check_team=True,
        check_demo=True,
        check_docs=True,
        check_tech_stack=True,
        check_media=True,
        check_faculty_verified=True,
    ),
    dict(
        title="CampusMed — Clinic Queue Optimizer",
        domain="SOFTWARE & AI",
        description="Full-stack scheduling app that predicts walk-in clinic wait times using historical queue data and live check-ins.",
        problem_statement="University health centers face long, unpredictable peak waiting periods, causing missed appointments and overstretched nursing staff.",
        team="T. Fernandes",
        team_size=1,
        team_roles="T. Fernandes (Sole Full-Stack Developer & Data Modeler)",
        year=2026,
        branch="Computer Science & Engineering",
        tags=["React", "Node.js", "ML forecasting"],
        tech_stack=["React", "Node.js", "PostgreSQL", "scikit-learn", "FastAPI"],
        github_url="https://github.com/demo/campusmed",
        demo_url="https://demo.projexus.io/campusmed",
        docs_url="https://demo.projexus.io/docs/campusmed-architecture.pdf",
        demo_type="static_web",
        media_urls=["https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80"],
        # Checklist: 15 (desc) + 10 (team) + 25 (demo) + 15 (docs) + 10 (tech) = 75%
        check_description=True,
        check_team=True,
        check_demo=True,
        check_docs=True,
        check_tech_stack=True,
        check_media=False,
        check_faculty_verified=False,
    ),
    dict(
        title="Autonomous Warehouse Rover",
        domain="ROBOTICS & MECHATRONICS",
        description="SLAM-based navigation rover for indoor logistics using LiDAR and a custom path-planning stack.",
        problem_statement="High-cost commercial AGVs cannot adapt easily to reconfigurable warehouse shelves without costly magnetic floor strip modifications.",
        team="A. Mehta, R. Kulkarni, S. Iyer",
        team_size=3,
        team_roles="A. Mehta (SLAM Algorithm), R. Kulkarni (Motor Drivers & Power), S. Iyer (ROS2 Navigation Node)",
        year=2025,
        branch="Robotics & Mechatronics",
        tags=["ROS2", "LiDAR SLAM", "C++", "Path planning"],
        tech_stack=["ROS2 Humble", "C++20", "Python", "RPLiDAR A2", "STM32", "Raspberry Pi 4"],
        github_url="https://github.com/demo/warehouse-rover",
        demo_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        docs_url="https://github.com/demo/warehouse-rover#readme",
        demo_type="video",
        media_urls=["https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80"],
        # Checklist: 15 (desc) + 10 (team) + 25 (demo) + 15 (docs) + 10 (tech) + 10 (media) = 85%
        check_description=True,
        check_team=True,
        check_demo=True,
        check_docs=True,
        check_tech_stack=True,
        check_media=True,
        check_faculty_verified=False,
    ),
    dict(
        title="Structural Health Monitor for Bridges",
        domain="CIVIL & STRUCTURAL",
        description="IoT sensor network detecting strain and vibration anomalies on bridge structures, with a live dashboard for inspectors.",
        problem_statement="Aging civil transit bridges experience undetected micro-stresses that accelerate concrete spalling before manual annual inspection dates.",
        team="K. Sharma, D. Verma",
        team_size=2,
        team_roles="K. Sharma (Civil Engineering Lead & FEA Modeling), D. Verma (IoT Sensors & Telemetry)",
        year=2025,
        branch="Civil & Structural Engineering",
        tags=["IoT", "Structural analysis", "Dashboard"],
        tech_stack=["ESP32", "InfluxDB", "Grafana", "Python", "Strain Gauges", "LoRaWAN"],
        github_url="https://github.com/demo/bridge-shm",
        demo_url="https://demo.projexus.io/bridge-dashboard",
        docs_url="https://github.com/demo/bridge-shm/blob/main/PROJECT_REPORT.pdf",
        demo_type="simulation_media",
        media_urls=["https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"],
        # Checklist: 15 (desc) + 10 (team) + 25 (demo) + 15 (docs) + 10 (tech) + 15 (faculty) = 90%
        check_description=True,
        check_team=True,
        check_demo=True,
        check_docs=True,
        check_tech_stack=True,
        check_media=False,
        check_faculty_verified=True,
    ),
]


def seed(db: Session):
    # Seed domains if not present
    for d_data in INITIAL_DOMAINS:
        existing_domain = db.query(models.Domain).filter(models.Domain.name == d_data["name"]).first()
        if not existing_domain:
            domain = models.Domain(
                name=d_data["name"],
                slug=d_data["slug"],
                description=d_data["description"],
            )
            db.add(domain)
    db.commit()

    # Seed users if not present
    recruiter = db.query(models.User).filter(models.User.email == "recruiter@demo.com").first()
    if not recruiter:
        recruiter = models.User(
            name="Apex Talent Recruiter",
            email="recruiter@demo.com",
            hashed_password=auth.hash_password("demo1234"),
            role="recruiter",
            organization="Apex Engineering Ventures",
        )
        db.add(recruiter)

    student = db.query(models.User).filter(models.User.email == "student@demo.com").first()
    if not student:
        student = models.User(
            name="Alex Chen",
            email="student@demo.com",
            hashed_password=auth.hash_password("demo1234"),
            role="student",
            organization="National Institute of Technology",
        )
        db.add(student)

    admin = db.query(models.User).filter(models.User.email == "admin@projexus.io").first()
    if not admin:
        admin = models.User(
            name="System Administrator",
            email="admin@projexus.io",
            hashed_password=auth.hash_password("admin1234"),
            role="admin",
            organization="Projexus Consortium",
        )
        db.add(admin)

    db.commit()
    db.refresh(recruiter)
    db.refresh(student)

    # Seed projects if empty
    if db.query(models.Project).count() == 0:
        for p in DEMO_PROJECTS:
            project = models.Project(
                title=p["title"],
                domain=p["domain"],
                description=p["description"],
                problem_statement=p["problem_statement"],
                team=p["team"],
                team_size=p["team_size"],
                team_roles=p["team_roles"],
                year=p["year"],
                branch=p["branch"],
                tags=",".join(p["tags"]),
                tech_stack=",".join(p["tech_stack"]),
                github_url=p["github_url"],
                demo_url=p["demo_url"],
                docs_url=p["docs_url"],
                demo_type=p["demo_type"],
                media_urls=",".join(p["media_urls"]),
                check_description=p["check_description"],
                check_team=p["check_team"],
                check_demo=p["check_demo"],
                check_docs=p["check_docs"],
                check_tech_stack=p["check_tech_stack"],
                check_media=p["check_media"],
                check_faculty_verified=p["check_faculty_verified"],
                owner_id=student.id,
            )
            db.add(project)
        db.commit()
        print(f"[Seed] Successfully seeded {len(DEMO_PROJECTS)} demo projects.")
