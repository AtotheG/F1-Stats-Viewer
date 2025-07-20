from app.main import create_app


# Ensure FastF1 data is ingested when the application starts
app = create_app(sync_on_startup=True)
