FROM python
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY app.py .
COPY attendant.py .
COPY map_my_india.py .
COPY boot.sh .
COPY templates templates
COPY assets assets
EXPOSE 5000
RUN chmod +x boot.sh
ENTRYPOINT [ "./boot.sh" ]